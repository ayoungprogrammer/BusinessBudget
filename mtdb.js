var db = require('./mongod.js');
var async = require('async');

db.init('mongodb://root:password123@oceanic.mongohq.com:10054/app20135974',function(){
	
	async.waterfall(
			[
			 function(cb){
				var root={};
				root.id = '';
				root.name = 'root';
				root.folder = true;
				root.children = ['staff','transport','tech','furniture'];
				db.updateItem(root,cb);
			},
			function(cb){
				db.exportBudgets(function(err,res){
					console.log('res: '+res);
					cb(err);
				});
			}],
			function(err){
				console.log(err);
			}
			
		);
	
	
	
	
});

