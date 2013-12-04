var db = require('../mongod.js');

var test_data = {"items" : 	[{'name' : 'Transport',
	'id': 'transport',
	'folder': true,
	'children':[{'name': 'Truck',
			'id': 'transport.truck',
			'desc':'A truck',
			'cost': 31250},
				]
	},
{'name' : 'Staff',
	'id': 'staff',
	'folder':true,
	'children':[{'name': 'Programmer',
			'id': 'staff.programmer',
			'desc':'A programmer',
			'cost': 82250},
           	]}
]};

/*

exports.deleteItems = function(test){
	db.deleteItem('transport.truck');
	test.equal(db.getItems()[0].children.length,0,"DELETE ITEM");
	
	test.equal(db.deleteItem('transport.car'),false,"DELETE INVALID ID");
	
	
	db.deleteItem('staff');
	test.equal(db.getItems().length,1,"DELETE FOLDER");
	
	test.equal(db.deleteItem('tools'),false,"DELETE NULL FOLDER");
	
	
	test.done();
};*/

exports.setUp=function(cb){
	db.init('mongodb://localhost/test',cb);
};

exports.tearDown = function(cb){
	db.disc();
	cb();
};

exports.createItems = function(test){

	
	//db.setData(test_data);
	
	var item = {'id':'staff.janitor',
			'name':'Janitor',
			'desc':'A janitor',
			'cost':1330};
	var folder = {'id':'tools',name:'Tools',folder:true};
	
	test.equal(db.createItem(item),true,"CREATE ITEM");
	
	console.log(db.getItems());
	
	test.equal(db.getItem('staff').children.length,2,"CREATE ITEM CHECK");
	
	test.equal(db.createItem(undefined),false,"CREATE NULL ITEM");
	
	item.id ='';
	test.equal(db.createItem(item),false,"CREATE ITEM MISSING PROPS");
	
	item.id = 'staff.janitor.broom';
	test.equal(db.createItem(item),false,"CREATE ITEM INVALID ID");
	
	db.createItem(folder);
	test.equal(db.getItems().length,3,"CREATE FOLDER");
	
	folder.id = '';
	test.equal(db.createItem(folder),false,"CREATE FOLDER MISSING PROPS");
	
	folder.id = 'tools.broom';
	test.equal(db.createItem(folder),false,"CREATE FOLDER INVALID ID");
	
	test.done();
};

/*
exports.updateItems = function(test){
	
	
	db.setData(test_data);
	
	var item = {'id':'staff.programmer',
			'name':'Janitor',
			'desc':'A janitor',
			'cost':1330};
	var folder = {'id':'staff',name:'Staffs',folder:true};
	
	test.equal(db.updateItem(item),true,"UPDATE ITEM");
	test.equal(db.getItem('staff.programmer').cost,1330,"UPDATE ITEM CHECK");
	
	test.equal(db.updateItem(undefined),false,"UPDATE NULL ITEM");
	
	item.id ='';
	test.equal(db.updateItem(item),false,"UPDATE ITEM MISSING PROPS");
	
	item.id = 'staff.janitor';item.cost = '';
	test.equal(db.updateItem(item),false,"UPDATE ITEM MISSING PROPS");
	
	test.equal(db.updateItem(folder),true,"UPDATE FOLDER");
	test.equal(db.getItem('staff').name,'Staffs',"UPDATE FOLDER CHECK");
	
	folder.id = '';
	test.equal(db.updateItem(folder),false,"UPDATE FOLDER MISSING PROPS");
	
	test.done();
};
*/