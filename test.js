var process=require('child_process');
var iconv = require('iconv-lite');
var encoding = 'cp936';
var binaryEncoding = 'binary';

var child=process.execFile("test.bat", ["http://192.168.3.83/liuwenjun/poseidon.git", "poseidon"],{ encoding: binaryEncoding }, function(error, stdout, stderr) {
    console.log("[err]"+error);
    console.log("[stdout]"+iconv.decode(new Buffer(stdout, binaryEncoding), encoding));
	console.log("[stderr]"+iconv.decode(new Buffer(stderr, binaryEncoding), encoding));
});