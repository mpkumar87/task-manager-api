const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_CONNECTION_URL, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then((response) => {
	console.log('Connected');
}).catch((error)=>{
	console.log(error.name);
});

/*

const task = new Task({
	description: "  This is new sample description for my task  ",
	completed: true
});

task.save().then((task) => {
	console.log(task);
}).catch((error) => {
	console.log(error);
});*/



/*const me = new User({
	name: "   prem  ",
	email: "  TEST@GMAIL.COM  ",
	password: "  demo123"
});

me.save().then((me) => {
	console.log(me);
}).catch((error) => {
	console.log(error)
});*/