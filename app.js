var express = require('./node_modules/express');
var util = require('util');
var app = express.createServer();
require('./mvc').boot(app);
app.listen(3000);

app.get(/.*/, function(req, res) {
  res.render("index");
});

util.log('Express app started on port 3000');