var http = require("http"),
    url  = require("url"),
    path = require("path"),
    fs   = require("fs");
 
exports.filter=function (req, res) {
    var pathname=__dirname+url.parse(req.url).pathname;
    if (path.extname(pathname)=="") {
        pathname+="/";
    }
    if (pathname.charAt(pathname.length-1)=="/"){
        pathname+="index.html";
    }
	console.log(pathname);
    fs.open(pathname,'r',function(err,fd){
		if (err) {
			res.writeHead(404, {"Content-Type": "text/html"});
            res.end("<h1>404 Not Found</h1>");
			console.log(res);
			return ;
		}
		switch(path.extname(pathname)){
			case ".html":
				res.writeHead(200, {"Content-Type": "text/html"});
				break;
			case ".js":
				res.writeHead(200, {"Content-Type": "text/javascript"});
				break;
			case ".css":
				res.writeHead(200, {"Content-Type": "text/css"});
				break;
			case ".gif":
				res.writeHead(200, {"Content-Type": "image/gif"});
				break;
			case ".jpg":
				res.writeHead(200, {"Content-Type": "image/jpeg"});
				break;
			case ".png":
				res.writeHead(200, {"Content-Type": "image/png"});
				break;
			default:
				res.writeHead(200, {"Content-Type": "application/octet-stream"});
		}
		
		fs.readFile(pathname,'utf8',function (err,data){
			console.log(res);
			res.writeHead(404, {"Content-Type": "text/html"});
            res.end("<h1>404 Not Found</h1>");
		});
        
    });
 
}