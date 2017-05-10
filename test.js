var process=require('child_process');
var iconv = require('iconv-lite');
var encoding = 'cp936';
var binaryEncoding = 'binary';

var child=process.spawn("test.bat", ["http://192.168.3.83/liuwenjun/poseidon.git", "poseidon"],{ encoding: binaryEncoding });
child.stdout.on("data",function(data){
	console.log(iconv.decode(new Buffer(data, binaryEncoding), encoding));
});
child.on("close",function(code,signal){
	console.log(code,signal);
});
