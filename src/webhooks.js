
exports.handle=function (req, res, body,db) {
	res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
	var json  = JSON.parse(body);
	if(req.headers["x-gogs-event"]){
		switch(req.headers["x-gogs-event"]){
			case "push":{
				db.push(json.repository.html_url,json.commits[0].message,json.commits[0].author.name,json.repository.name);
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
	}else{
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
}