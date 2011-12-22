var express = require('./node_modules/express');
var util = require('util');
var app = express.createServer();
var io  =  require('./node_modules/socket.io').listen(app);
require('./mvc').boot(app);
app.listen(3000);

util.log('Express app started on port 3000');
