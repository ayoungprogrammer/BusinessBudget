var mongoose = require('mongoose');
var async = require('async');
var db;
var itemModel;
var budgetModel;


exports.clear = function(callback){
	async.waterfall(
			[function(cb){
				itemModel.remove({},function(err){
					cb(err);
				});
			},
			function(cb){
				var root = new itemModel();
				root.id = '';
				root.name = 'root';
				root.children = [];
				root.folder = true;
				
				root.save(function(err){
					cb(err);
				});
			}],function(err){
				if(err){
					console.log('CLEAR: '+err);
				}
				callback(err);
			});
};

exports.init = function(loc,cb){
	try{
		
		db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function(){
			console.log('Opened connection to '+loc);
			cb();
		});
		mongoose.connect(loc);
		console.log('Started connection to '+loc);
		var itemSchema = require('./models/item.js').ItemSchema;
		itemModel = db.model('items',itemSchema);
		
		var budgetSchema = require('./models/budget.js').BudgetSchema;
		budgetModel = db.model('budget',budgetSchema);
	
		exports.exportDB(function(err,res){
			if(res.length==0){
				console.log('New DB detected, initalizing DB');
				exports.clear(function(err){
					if(err){
						console.log('DB not initialized');
					}else {
						console.log('DB initialized');
					}
				});
			}
		});
		
	}catch(err){
		console.log(err.message);
	}
};



var cached = undefined;


exports.disc = function(){
	db.disconnect();
};

exports.getItems = function (cb){
	getItem('',function(err,root){
		
		getItems(root,function(err,tree){
			if(err){
				console.log('GET ITEMS ERROR: '+err);
			}
			cb(err,tree);
		});
	});
	
};

function getItems(item,cb){
	//console.log(item);
	async.reduce(item.children,[],function(memo,id,cb){
		
		getItem(id,function(err,child){
			if(!child){
				cb(false,memo);
			}else {
				getItems(child,function(err,tree){
					if(err){
						cb(err);
					}else {
						if(!tree){
							cb(false,memo);
						}else {
							memo.push(tree);
							cb(false,memo);
						}
					}
				});
			}
		});
		
	},function(err,result){
		if(err){
			cb(err);
		}else {
			var tree= {};
			tree.id = item.id;
			tree.name = item.name;
			
			if(!tree.folder){
				tree.children = result;
				tree.cost = item.cost;
				tree.desc = item.desc;
			}
			tree.folder = item.folder;
			
			cb(err,tree);
		}
	});
	
}

exports.exportDB = function(cb){
	itemModel.find({}).exec(function(err, result) {
		  if (!err) {
		    cb(err,result);
		  } else {
		    // error handling
			 console.log('EXPORT DB: ERROR EXPORTING: '+err);
		  };
		});
};

exports.exportBudgets = function(cb){
	budgetModel.find({}).exec(function(err, result) {
		  if (!err) {
			    cb(err,result);
			  } else {
			    // error handling
				 console.log('EXPORT DB: ERROR EXPORTING: '+err);
			  };
			});
};

exports.getItem = function(id,cb){
	
	getItem(id,cb);
};

function getItem(id,cb){
	var regexp = new RegExp('^'+id+'$','g');
	itemModel.findOne({'id':regexp},function(err,result){
		if(err){
			cb(err);
		}else if (!result){
			cb('GET ITEM: RESULT NOT FOUND');
		}
		else {
			cb(false,result);
		}
	});
}


exports.deleteItem = function(id,cb){
	
	if(id==''){
		cb('DELETE: ERROR CANNOT REMOVE ROOT');
	}else {
		
		var regexp = new RegExp('^'+id+'$','g');
		itemModel.remove({'id': regexp},function(err){
			cb(err);
		});
			
		
		
	}
};

function checkItem(item,cb){
	
	
	
	if(!item){
		return "CHECK: ERROR ITEM UNDEFINED";
	}
	
	if(item.name==''){
		return "CHECK: ERROR ROOT CANNOT BE CHANGED";
	}
	
	if(item.folder){
		if(item.id==undefined||item.id==null || !item.name){
			return "CHECK: ERROR ADDING FOLDER (MISSING PROPS)";
		}
	}
	else{
		if(!item.name || !item.desc||!item.cost ||!item.name ||!item.id){
			return "CHECK: ERROR ADDING ITEM (MISSING PROPS)";
		}
	}
	return false;
}

function parentID(id){
	if(id.indexOf('.')<0){
		return '';
	}
	else return id.slice(0,id.lastIndexOf('.'));
}

exports.createItem=function(item,callback){
	
	async.waterfall(
			[function(cb){
				cb(checkItem(item));
			},
			function(cb){
				//console.log(parentID(item.id)+" "+item.id);
				getItem(parentID(item.id),function(err,res){
					cb(err,res);
				});

			},
			function(parentNode,cb){
				if(parentNode.children.indexOf(item.id)<0){
						parentNode.children.push(item.id);
				}
				parentNode.save(function(err){
					cb(err);
				});
			},
			function(cb){
				var itemObj = new itemModel();
				itemObj.id = item.id;
				if(item.folder){
					itemObj.folder = item.folder;
					itemObj.children = [];
				}else {
					itemObj.cost = item.cost;
				}
				itemObj.desc = item.desc;
				itemObj.name = item.name;
				
				itemObj.save(function(err){
					cb(err);
				});
			
			}],function(err,result){
				if(err){
					console.log('CREATE ERROR: '+err);
				}
				else {
				}
				callback(err);
			});
	
	
};

exports.updateItem = function(item,cb){
	async.waterfall([function(cb){
		cb(checkItem(item));
	},function(cb){
		getItem(item.id,function(err,res){
			cb(err,res);
		});
	},function(oldItem,cb){
		if(!oldItem){
			cb("ERROR: ITEM NOT FOUND");
			return;
		}
		oldItem.name = item.name;
		oldItem.folder = item.folder;
		if(item.folder){
			oldItem.folder = item.folder;
			oldItem.children = item.children;
		}
		if(!item.folder){
			oldItem.desc = item.desc;
			oldItem.cost = item.cost;
		}
		
		oldItem.save(function(err){
			cb(err);
		});
	}],function(err){
		if(err){
			console.log('UPDATE ERROR: '+cb);
		}
		cb(err);
	});
};



function insertItem(item,cb){
	
	var itemObj = new itemModel();
	itemObj.id = item.id;
	itemObj.folder = item.folder;
	itemObj.cost = item.cost;
	itemObj.name = item.name;
	itemObj.children = [];
	
	itemObj.save(function(err){
		if(!err){
			cb(false);
		}else {
			cb('ERROR SAVING');
		}
	});
};

exports.saveBudget = function(budget,cb){
	async.waterfall(
			[function(cb){
				var budgetObj = new budgetModel();
				budgetObj.info = JSON.stringify(budget);
				budgetObj.save(function(err){
					cb(err,budgetObj._id);
				});
			}],
			function(err,res){
				cb(err,res);
				
			}
				
	);
};

exports.getBudget = function(id,cb){
	budgetModel.findById(id,function(err,prod){
		if(err){
			cb(err);
		}else{
			if(prod&&prod.info){
				cb(err,JSON.parse(prod.info));
			}
			else cb(err);
		}
	});
};
