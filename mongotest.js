var db = require('./mongod.js');
var async = require('async');

var item = {'id':'staff.janitor',
		'name':'Janitor',
		'desc':'A janitor',
		'cost':1330};
var item2 = {'id':'staff.programmer',
		'name':'Programmer',
		'desc':'Programmer',
		'cost':1330};

var fold = {'id':'staff','name':'Staff','folder':true};

db.init('mongodb://localhost/test',function(){});

function test(err,res){
	console.log(err);
	console.log(res);
}



async.waterfall(
	[function(cb){
		db.clear(cb);
	},
	function(cb){
		db.createItem(fold,cb);
	},
	function(cb){
		db.createItem(item,cb);
	},
	function(cb){
		item.name = 'cleaning guy';
		db.updateItem(item,cb);
	},
	function(cb){
		db.deleteItem('staff',cb);
	},
	function(cb){
		db.exportDB(function(err,res){
			console.log('res: '+res);
			cb(err);
		});
	}],
	function(err){
		if(err){
			console.log(err);
		}
		db.getItems(test);
	}
	
);

