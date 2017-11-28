
/**
 * Module dependencies.
 */

const express = require('express');
const http = require('http');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const db = require('./config/db');

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
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err)
    require('./routes')(app, database);
    http.createServer(app).listen(app.get('port'), () => {
        console.log('Express server listening on port ' + app.get('port'));
    });
})


