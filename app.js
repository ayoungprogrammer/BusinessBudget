
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var api = require('./api');

var db = mongoose.createConnection('localhost','busbud');
var app = express();



var itemSchema = require('./models/item.js').ItemSchema;
var item = db.model('items',itemSchema);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//routes
app.get('/', routes.index);
app.get('/admin',routes.admin);

//api
app.get('/api/items',api.items);
app.put('/api/items',api.updateItem);
app.post('/api/items',api.createItem)
app.delete('/api/items/:id',api.deleteItem);


//Error routes
app.use(routes.notFound);
app.use(routes.errorPage);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
