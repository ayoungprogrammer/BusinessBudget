
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Budget' });
};
exports.admin = function(req,res){
	res.render('admin',{title:'Admin'})
}

exports.notFound = function(req, res){

	  res.render('error404', {serv:req});
	};

exports.errorPage = function(err, req, res, next){
	
	res.render('error500',{error:err});
	
};