const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
	//const task = new Task(req.body);
	const task = new Task({
		...req.body,//... ES6 spread operator
		owner: req.user._id
	})
	try {
		await task.save();
		res.send(task);
	} catch (e) {
		res.status(400).send(e);
	}
	/*task.save().then(() => {
		res.send(task);
	}).catch((e) => {
		res.status(400);
		res.send(e);
	});*/
});

router.get('/tasks', auth, async (req, res) => {
	var is_completed = {};
	var sort = {};
	if (req.query.sort_column) {
		sort[req.query.sort_column] = req.query.order === 'desc' ? -1 : 1;
	}
	if (req.query.completed) {
		is_completed.completed = req.query.completed === 'true';
	}

	const limit = parseInt(req.query.limit);
	const page  = parseInt(req.query.page);
	const skip 	= (page - 1) * limit;
	try {
		const tasks = await Task.find({
			owner: req.user._id,
			...is_completed
		}, null, {
			limit,
			skip,
			sort
		});
		res.send(tasks);
	} catch (e) {
		res.status(500).send(e);
	}

	/*Task.find({}).then((tasks) => {
		res.send(tasks);
	}).catch((e) => {
		res.status(500);
		res.send(e);
	});*/
});

router.get('/tasks/:id', auth, async (req, res) => {
	const _id = req.params.id;
	try {
		//const task = await Task.findById(_id);
		const task = await Task.findOne({_id, owner: req.user._id});
		await task.populate('owner').execPopulate(); // to get owner information from other table
		if (!task) {
			return res.status(404).send('No record found');
		}
		res.send(task);
	} catch (e) {
		res.status(500).send(e);
	}
	/*Task.findById(_id).then((task) => {
		if (!task) {
			return res.status(404).send('No record found');
		}
		res.send(task);
	}).catch((e) => {
		res.status(500);
		res.send(e);
	});*/
});

router.patch('/tasks/:id', auth, async (req, res) => {
	const _id = req.params.id;
	const updates = Object.keys(req.body);
	const allowedUpdates = ['description', 'completed'];
	const isValidOperation = updates.every((update) => {
		return allowedUpdates.includes(update)
	});

	if (!isValidOperation) {
		return res.status(400).send('Invalid updates..');
	}

	try {

		// Updates code to use for middleware
		const task = await Task.findOne({_id, owner: req.user._id});

		/*const task = await Task.findByIdAndUpdate(_id, req.body, {
			new: true,
			runValidators: true
		});*/

		if (!task) {
			return res.status(404).send('No record found');
		}

		updates.forEach((update) => {
			task[update] = req.body[update];
		});
		await task.save();
		 
		res.send(task);

	} catch (e) {
		res.status(400).send(e);
	}
});

router.delete('/tasks/:id', auth, async (req, res) => {
	const _id = req.params.id;
	try {
		//const task = await Task.findByIdAndDelete(_id);
		const task = await Task.findOneAndDelete({_id, owner: req.user._id});
		if (!task) {
			return res.status(404).send('No record found');
		}
		res.send(task);
	} catch (e) {
		res.status(400).send(e);
	}
});

module.exports = router;