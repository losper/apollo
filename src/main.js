var http = require('http');
var reshandler = require('./reshandler');
var querystring = require('querystring');
var url = require("url");
var db=require('./db.js');

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
		res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
		var json  = JSON.parse(body);
		
		switch(json.object_kind){
			case "push":{
				db.push(json.repository.git_http_url,json.commits[0].message,json.user_name,json.repository.name);
				res.end();
			}
			break;
			case "history":
				db.getHistory(res);
			break;
			case "currentVersion":
				db.getVersion(res);
			break;
			default:
			res.end();
			break;
		}
	}
  });
}).listen(80);

