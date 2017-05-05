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
	var params = url.parse(req.url, true).query;
	var ext=url.parse(req.url).pathname;
	switch(ext){
		case "/log":
			db.getlog(res,params.id);
		break;
		case "/build":
			if (typeof(params.root) == "undefined" || typeof(params.url) == "undefined") { 
				webhooks.handle(req,res,body,db,"","");
			}else{
				webhooks.handle(req,res,body,db,params.root,params.url);
			}
		break;
		default:
			if (typeof(params.action) == "undefined") { 
				reshandler.filter(req,res,ext);
			}else{
				reshandler.download(req,res,process.cwd()+ext);
			}
		break;
	}
  });
}).listen(8008);

