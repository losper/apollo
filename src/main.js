var https = require('https');
var fs = require('fs');
var index = fs.readFileSync('src/index.html');

https.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(index);
}).listen(80);
https.on()