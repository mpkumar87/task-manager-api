const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;
/*const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '15mb'
}));
app.use(bodyParser.json({limit: '15mb'}));*/

/*app.use((req, res, next) => {
	next();
});*/

/*const multer = require('multer');
const upload = multer({
	dest: 'images',
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb) {
		//if (!file.originalname.match(/\.(doc|docs)$/)) {
		if (!file.originalname.endsWith('.pdf')) {
			return cb(new Error('Please upload a PDF'));
		}

		cb(undefined, true);
	}
});

app.post('/upload', upload.single('upload'), (req, res) => {
	res.send();
});*/

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log('Server is up on port ' + port);
});