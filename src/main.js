var http = require('http');
var reshandler = require('./reshandler');
var querystring = require('querystring');
var url = require("url");
var db=require('./db.js');
var webhooks=require('./webhooks.js');
db.setup("queue.db");


http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  
  req.on('end', function () {
    // 设置响应头部信息及编码
	
	if(body==""){
		var params = url.parse(req.url, true).query;
		var ext=url.parse(req.url).pathname;
		console.log(ext);
		if(ext=="/log"){
			db.getlog(res,params.id);
		}else{
			reshandler.filter(req,res,ext);
		}
	}else{
		webhooks.handle(req,res,body,db);
	}
  });
}).listen(8008);

