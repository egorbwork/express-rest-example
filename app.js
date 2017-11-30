
/**
 * Module dependencies.
 */

const express = require('express');
const http = require('http');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const db = require('./config/db');
const cors = require('cors')

var app = express();

// all environments
app.set('port', process.env.PORT || 7999);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.disable('etag');

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err);
    app.options('*', cors());
    app.all('/*',function(req,res,next){
        res.header('Access-Control-Allow-Origin' , '*');
        next(); // http://expressjs.com/guide.html#passing-route control
    });
    require('./routes')(app, database);
    http.createServer(app).listen(app.get('port'), () => {
        console.log('Express server listening on port ' + app.get('port'));
    });
})


