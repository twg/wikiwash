// == Imports ===============================================================

var express = require('express');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var path = require('path');

var config = require('./config/config');
var events = require('./config/events');

var log = require('./config/log').createLoggerForFile(__filename);

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// ==  Constants ============================================================

var frontendDir = path.join(__dirname, '..', 'frontend');
var publicDir = path.join(__dirname, '..', 'public');

// == Composition ===========================================================

app.use('/frontend/assets', express.static(path.join(frontendDir, 'assets')));
app.use('/img', express.static(path.join(frontendDir, 'assets', 'img')));

app.use(express.static(publicDir));
app.use('/js', express.static(path.join(publicDir, 'js')));
app.use('/css', express.static(path.join(publicDir, 'css')));
app.use('/views', express.static(path.join(publicDir, 'views')));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(partials());

app.set('views', path.join(publicDir, 'views'));

app.use(require('./config/routes'));
events(io);

http.listen(process.env.PORT || 3000, function() {
  log.info('WikiWash listening on *:' + (process.env.PORT || 3000));
  log.info(' * Set PORT envirnoment variable when starting server to change this')
});
