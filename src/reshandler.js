var http = require("http"),
    path = require("path"),
    fs   = require("fs");
	
//依据路径获取返回内容类型字符串,用于http响应头 
var funGetContentType = function (filePath) {
    var contentType = "";
    
    //使用路径解析模块获取文件扩展名 
    var ext = path.extname(filePath);

    switch (ext) {
        case ".html":
            contentType = "text/html";
            break;
        case ".js":
            contentType = "text/javascript";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".gif":
            contentType = "image/gif";
            break;
        case ".jpg":
            contentType = "image/jpeg";
            break;
        case ".png":
            contentType = "image/png";
            break;
        case ".ico":
            contentType = "image/icon";
            break;
        default:
            contentType = "application/octet-stream";
			break;
    }
    //返回内容类型字符串 
    return contentType;
}
exports.filter=function (req, res,ext) {
    var pathname=__dirname+ext;
    if (path.extname(pathname)=="") {
        pathname+="/";
    }
    if (pathname.charAt(pathname.length-1)=="/"){
        pathname+="index.html";
    }
	
	console.log(pathname);
	fs.readFile(pathname, function(err, data){
		if (err) {
			res.writeHead(404, {"Content-Type": "text/html"});
			res.end("<h1>404 Not Found</h1>");
			console.log(err);
		} else {
			res.writeHead(200, {"Content-Type": funGetContentType(pathname)});
			res.end(data);
		}
	});
}
exports.download=function (req, res,pathname) {
    console.log(pathname);
	fs.readFile(pathname, function(err, data){
		if (err) {
			res.writeHead(404, {"Content-Type": "text/html"});
			res.end("<h1>404 Not Found</h1>");
			console.log(err);
		} else {
			res.writeHead(200, {"Content-Type": funGetContentType(pathname)});
			res.end(data);
		}
	});
}