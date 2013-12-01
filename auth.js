exports.checkAuth = function(req, res, next) {
  if (!req.session.auth) {
    res.redirect('view/accessDenied');
  } else {
    next();
  }
};

exports.login = function(req,res){
	var post = req.body;
	if(post.username=='Admin' && post.password == 'password'){
		console.log('LOGIN: SUCCESS');
		req.session.auth = true;
		res.json(true);
	}else {
		console.log('LOGIN: FAIL');
		res.json(false);
	}
};
