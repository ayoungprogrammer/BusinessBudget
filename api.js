var mongoose = require('mongoose');

var db = require('./dummydb.js');

//DB interface
function deleteItem(id){
	return db.deleteItem(db.getItems(),id.split('.'));
}


//Exports
exports.createItem = function (req,res){
	console.log("ADD: ");
	res.json(db.createItem(req.body));
};

exports.updateItem = function(req,res){
	console.log("UPDATE: ");
	res.json(db.updateItem(req.body));
};

exports.deleteItem = function (req,res){
	var id = req.params.id;
	console.log("DELETE: "+id);
	res.json(db.deleteItem(id));
	
};

exports.items = function(req,res){
	var items = db.getItems();
	res.json({items:items});
};

