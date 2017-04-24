var http = require('http');
var reshandler = require('./reshandler');
var querystring = require('querystring');
 
var postHTML = "test";
var queue=[];
var queue_over=[];
var queue_dev=[];
var queue_ver=[];
var jobstatus=0;
function run_cmd(cmd, args) {
	var callfile = require('child_process');
	var child = callfile.execFile(cmd,args,null,function (err, stdout, stderr) {	  
		if(err==""){
			
		}
		console.log("err:"+err);
		console.log("stdout:"+stdout);
		console.log("stderr:"+stderr);
	});
	child.on("close",function(data){
		if(queue.length){
			var job=queue.pop();
			run_cmd("deploy.bat",[job.repository.git_http_url,job.repository.name]);
			
		}else{
			
			jobstatus=0;
		}
	});
}
 
http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    // 设置响应头部信息及编码
	if(body==""){
		reshandler.filter(req,res);
	}else{
		res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
		var json  = JSON.parse(body);
		if(json.object_kind=="push"){
			queue.push(json);
			if(!jobstatus){
				jobstatus=1;
				var job=queue.pop();
				run_cmd("deploy.bat",[job.repository.git_http_url,job.repository.name]);
			}else{
				console.log("wait for queue!");
			}
		}
	}
    res.end();
  });
}).listen(80);