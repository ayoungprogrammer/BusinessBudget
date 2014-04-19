
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var api = require('./api');
var auth = require ('./auth');


var app = express();









// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use( express.cookieParser() );
app.use(express.session({secret: "what does this do"}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//routes

app.get('/', routes.index);
app.get('/view/admin',auth.checkAuth);
app.get('/view/:name',routes.view);
//app.get('/login',routes.login);
//app.get('/admin',auth.checkAuth,routes.admin);
//app.get('/accessDenied',routes.accessDenied);
//app.get('/invalid',routes.invalid);
//app.get('/budget',routes.budget);

//auth
app.post('/login',auth.login);

//api
app.post('/api/budget',api.saveBudget);
app.get('/api/budget/:id',api.getBudget);

app.put('/api/*',auth.checkAuth);
app.post('/api/*',auth.checkAuth);
app.delete('/api/*',auth.checkAuth);

app.get('/api/items',api.items);
app.put('/api/items',api.updateItem);
app.post('/api/items',api.createItem);
app.delete('/api/items/:id',api.deleteItem);




app.get('*',routes.index);

//Error routes
app.use(routes.notFound);
app.use(routes.errorPage);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
