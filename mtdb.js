var db = require('./mongod.js');
var async = require('async');

db.init('mongodb://localhost/app',function(){
	
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
				db.exportDB(function(err,res){
					console.log('res: '+res);
					cb(err);
				});
			}],
			function(err){
				console.log(err);
			}
			
		);
	
	
	
	
});

