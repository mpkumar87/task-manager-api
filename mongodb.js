//const mongodb = require('mongodb');
//const MongoClient = mongodb.MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
	if (error) {
		return console.log('Unable to connect to database');
	}

	const db = client.db(databaseName);
	//const collection = db.collection('users');
	const collection = db.collection('tasks');

	/*collection.deleteMany({
		name: 'Kumar'
	}).then((result) => {
		console.log(result);
	}).catch((error) => {
		console.log(error);
	});*/

	collection.deleteOne({
		description: 'Demo'
	}).then((result) => {
		console.log(result);
	}).catch((error) => {
		console.log(error);
	});

	/*collection.updateOne({
		_id: new ObjectID('5c9caa2255c42c0624736243')
	},{
		$set: {
			name: 'Kumar1'
		}
	}).then((result) => {
		console.log(result);
	}).catch((error) => {
		console.log('Error ', error);
	});*/

	/*collection.updateMany({
		completed: false
	},{
		$set: {
			completed: true
		}
	}).then((result) => {
		console.log(result);
	}).catch((error) => {
		console.log(error);
	});*/

	/*collection.findOne({_id: new ObjectID('5c9cb93d8cf7e42bb8819835')}, (error, task) => {
		if (error) {
			return console.log(error);
		}
		console.log(task);
	});*/

	/*collection.find({completed: false}).toArray((error, tasks) => {
		if (error) {
			return console.log(error);
		}
		console.log(tasks);
	});*/


	//collection.findOne({name: 'Sample'}, (error, user) => { // By name field
	/*collection.findOne({_id: new ObjectID('5c9cad1e2b98030aacfb7e4b')}, (error, user) => { // By unique id field
		if (error) {
			return console.log(error);
		}
		console.log(user);
	});*/

	/*collection.find({name: 'Kumar'}).toArray((error, users) => {
		if (error) {
			return console.log(error);
		}
		console.log(users);
	});*/

	/*collection.insertMany([
	{
		name: 'Kumar',
		age: 20
	},
	{
		name: 'Sample',
		age: 25
	},
	{
		name: 'Demo',
		age: 35
	}
	], (error, result) => {
		if (error) {
			return console.log(error);
		}
		console.log(result.ops);
	});*/

	/*collection.insertMany([
	{
		description: 'Welcome',
		completed: true
	},
	{
		description: 'Sample',
		completed: false
	},
	{
		description: 'Demo',
		completed: true
	}
	], (error, result) => {
		if (error) {
			return console.log(error);
		}
		console.log(result.ops);
	});*/

	/*collection.insertOne({
		name: 'Kumar',
		age: 20
	}, (error, result) => {
		if (error) {
			return console.log(error);
		}
		console.log(result.ops);
	});*/

});