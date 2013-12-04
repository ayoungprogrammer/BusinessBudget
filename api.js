var mongoose = require('mongoose');

var db = require('./mongod.js');
//var db = require('./dummydb.js');

db.init('mongodb://localhost/app',function(){});

//Exports
exports.createItem = function (req,res){
	console.log("ADD: ");
	//res.json(db.createItem(req.body));
	
	db.createItem(req.body,function(err){
		res.json(err);
	});
};

exports.updateItem = function(req,res){
	console.log("UPDATE: ");
	//res.json(db.updateItem(req.body));
	
	db.updateItem(req.body,function(err){
		res.json(err);
	});
};

exports.deleteItem = function (req,res){
	var id = req.params.id;
	console.log("DELETE: "+id);
	//res.json(db.deleteItem(id));
	
	db.deleteItem(req.body,function(err){
		res.json(err);
	});
	
};

exports.items = function(req,res){
	//console.log(db.getItems());
	//res.json(db.getItems());
	
	db.getItems(function(err,items){
		//console.log("GET: "+items);
		res.json(items);
	});
	
};

