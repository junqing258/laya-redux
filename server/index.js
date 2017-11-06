var express = require("express");
var http = require("http");
var Primus = require("primus");
var CryptoJS = require("crypto-js");
 
/*// Encrypt 
var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');
// Decrypt 
var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
var plaintext = bytes.toString(CryptoJS.enc.Utf8);
console.log(plaintext);*/

var app = express();
var server = http.createServer(app);
var primus = Primus(server);

server.listen(3000, function(){
  console.log('listening on *:3000');
});

primus.on("outgoing::error", function(error) {
	console.log("outgoing::error");
	throw error;
});
primus.on("incoming::error", function(error) {
	console.log("incoming::error");
	throw error;
});
primus.on("incoming::url", function(url) {
	console.log(url);
});
primus.on('open', function (data) {
    console.log("连接成功", data);
});
primus.on('connection', function(spark) {
	spark.emit("incoming::open");
	spark.on('data', function(data) {
		console.log('received data:', data);
		if ('foo' !== data.secrethandshake) spark.end();
		spark.write({
			foo: 'bar'
		});
		spark.write('banana');
	});
	spark.write('Hello world');
});
primus.on('data', function (data) {
    console.log("on data:", data);
});

function send() {

}