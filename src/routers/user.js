const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');
const {sendWelcomeEmail, sendCancelEmail} = require('../emails/account');

router.post('/users', async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		const mail_response = await sendWelcomeEmail(user.email, user.name);
		console.log(mail_response);
		const token = await user.generateAuthToken();
		res.send({user, token});
	} catch (e) {
		res.status(400).send(e);
	}
	/*user.save().then(() => {
		res.send(user);
	}).catch((e) => {
		res.status(400);
		res.send(e);
	});*/
});

router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		res.send({user, token});
	} catch (e) {
		res.status(400).send(e);
	}
});

router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});

		await req.user.save();
		res.send('Logout success');
	} catch (e) {
		res.status(500).send();
	}
});

router.post('/users/logoutAll', auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send('Logout from all session success');
	} catch (e) {
		res.status(500).send();
	}
});

router.get('/users/me', auth, async (req, res) => {
	res.send(req.user);
	/*try {
		const users = await User.find({});
		res.send(users);
	} catch (e) {
		res.status(500).send(e);
	}*/
	/*User.find({}).then((users) => {
		res.send(users);
	}).catch((e) => {
		res.status(500);
		res.send(e);
	});*/
});

router.get('/users/:id', async (req, res) => {
	const _id = req.params.id;
	try {
		const user = await User.findById(_id);
		if (!user) {
			return res.status(404).send('No record found');
		}
		res.send(user);
	} catch (e) {
		res.status(500).send(e);
	}
	/*User.findById(_id).then((user) => {
		if (!user) {
			return res.status(404).send('No record found');
		}
		res.send(user);
	}).catch((e) => {
		res.status(500);
		res.send(e);
	});*/
});

router.patch('/users/me', auth, async (req, res) => {
	//const _id = req.params.id;
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'email', 'age', 'password'];
	const isValidOperation = updates.every((update) => {
		return allowedUpdates.includes(update)
	});

	if (!isValidOperation) {
		return res.status(400).send('Invalid updates..');
	}

	try {

		// Updates code to use for middleware
		//const user = await User.findById(_id);
		const user = req.user;
		updates.forEach((update) => {
			user[update] = req.body[update];
		});
		await user.save();

		/*const user = await User.findByIdAndUpdate(_id, req.body, {
			new: true,
			runValidators: true
		});*/

		/*if (!user) {
			return res.status(404).send('No record found');
		}*/
		 
		res.send(user);

	} catch (e) {
		res.status(400).send(e);
	}
});

//router.delete('/users/:id', async (req, res) => {
router.delete('/users/me', auth, async (req, res) => {
	//const _id = req.params.id;
	try {
		//const user = await User.findByIdAndDelete(_id);
		//const user = await User.findByIdAndDelete(req.user._id);
		/*if (!user) {
			return res.status(404).send('No record found');
		}*/

		await req.user.remove();
		const mail_response = await sendCancelEmail(req.user.email, req.user.name);
		console.log(mail_response);
		res.send(req.user);
	} catch (e) {
		res.status(400).send(e);
	}
});

const upload = multer({
	//dest: 'avatars',
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error('Please upload image (jpg, jpeg and png)'));
		}

		cb(undefined, true);
	}
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
	console.log(req.file);
	const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
	req.user.avatar = buffer;
	await req.user.save();
	res.send('Profile picture uploaded successfully');
}, (error, req, res, next) => {
	res.status(400).send({
		error: error.message
	})

});

router.delete('/users/me/avatar', auth, async (req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send('Profile picture removed successfully');
});

router.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user || !user.avatar) {
			throw new Error('Failed to fetch record');
		}

		res.set('Content-Type', 'image/png');
		res.send(user.avatar);
	} catch(e) {
		res.status(404).send();
	}
});

module.exports = router;