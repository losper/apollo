var sqlite3 = require('sqlite3').verbose();
var fs = require("fs");
var iconv = require('iconv-lite');
var encoding = 'cp936';
var binaryEncoding = 'binary';
var db;
var jobstatus=0;
function buildQueue(){
	if(jobstatus) return ;
	jobstatus=1;
	console.log("buildQueue");
    db.all("SELECT * FROM queue where status==0 limit 0,1",function(err,row){
		if(err){
			jobstatus=0;
			console.log("buildQueue:"+err);
			return ;
		}else{
			if(row.length){
				run_cmd("deploy.bat",row[0].id,[row[0].url,row[0].project]);
			}else{
				jobstatus=0;
				console.log("buildQueue:hasnot wait queue!!!");
			}
		}
	});
};
function run_cmd(cmd,id, args) {
	var callfile = require('child_process');
	var cmderr="",cmdout="",runerr="";
	var child = callfile.spawn(cmd,args,{ encoding: binaryEncoding,timeout:1200000 });
	// child.on("close",function(data){
		// console.log("close:",data);
		// buildQueue();
	// });
	child.stdout.on("data",function(data){
		cmdout+=data;
	});
	child.stderr.on("data",function(data){
		cmderr+=data;
	});
	child.on("error",function(err){
		console.log("execfile error:",err);
		runerr=err;
	});
	child.on("close",function(code,signal){
		console.log("execfile close:",code,signal);
		if(code==0){
			db.run("UPDATE queue SET status = ?, log=? WHERE id = ?", 2, iconv.decode(new Buffer(cmderr+cmdout, binaryEncoding), encoding), id);
			var apppath="public/"+args[1]+id+".7z";
			var tmp="tmp/"+args[1]+"/tmp.7z"
			fs.rename(tmp,apppath,function(err){
				 if(err){
					 console.log("rename error:",err);
				 }else{
					db.run("UPDATE queue SET apppath = ? WHERE id = ?", apppath, id);
				 }		 
			 });
		}else{
			db.run("UPDATE queue SET status = ?, log=? WHERE id = ?", 1, iconv.decode(new Buffer("[err]"+runerr+"[stderr]"+cmderr+"[stdout]"+cmdout, binaryEncoding), encoding), id);
		}
		jobstatus=0;
		buildQueue();
	})
}
function createTable(err){
	if(err){
		console.log("error",err);
		return ;
	}
    db.run("CREATE TABLE queue (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT,message TEXT, username TEXT, project TEXT, status INT, version TEXT, log TEXT,apppath TEXT,root TEXT,rooturl TEXT)",function(err){
		if(err){
			if(err.errno==1){
				buildQueue();
			}
			console.log("error",err);
			return ;
		}else{
			buildQueue();
		}
	});
}
exports.setup=function(path){
	db=new sqlite3.Database(path,createTable);
};
exports.push=function(url,message,username,project,root,rooturl){
	console.log("insertRows ",url,message,username,project,root,rooturl);
    db.run("INSERT INTO queue VALUES (?,?,?,?,?,?,?,?,?,?,?)",null,url,message,username,project,0,"","","",root,rooturl);
	buildQueue();
};
exports.buildQueue=buildQueue;

exports.getHistory=function(res){
	db.all("SELECT * FROM queue ORDER BY id DESC",function(err,rows){
		res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
		res.write(JSON.stringify(rows));
		res.end();
	});
};
exports.getVersion=function(res){
	db.all("SELECT * FROM queue where id==(SELECT max(id) FROM queue where status==2)",function(err,rows){
		res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
		if(err){
			console.log("getVersion:"+err);
			res.write("{has:0}");
			return ;
		}else{
			res.write(JSON.stringify(rows));
		}
		res.end();
	});
};
exports.getlog=function(res,id){
	db.all("SELECT log FROM queue where id==?",id,function(err,rows){
		res.writeHead(200, {'Content-Type': ' text/plain; charset=utf8'});
		if(err){
			console.log("getlog:"+err);
			res.write("404");
			return ;
		}else{
			res.write(rows[0].log);
		}
		res.end();
	});
};