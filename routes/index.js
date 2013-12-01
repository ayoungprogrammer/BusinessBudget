
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Budget' });
};
exports.view = function(req,res){
	var name = req.params.name;
	console.log('view/'+name);
	res.render('view/'+name);
};

exports.notFound = function(req, res){

	  res.render('error404', {serv:req});
	};

exports.errorPage = function(err, req, res, next){
	
	res.render('error500',{error:err});
	
};

