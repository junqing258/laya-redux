var express = require("express");
var http = require("http");
var Primus = require("primus");

var app = express();
var server = http.createServer(app);
var primus = Primus(server);

server.listen(3000, function(){
  console.log('listening on *:3000');
});

primus.on("outgoing::error", function(error) {
	console.log("outgoing::error", error);
});
primus.on("incoming::error", function(error) {
	console.log("incoming::error", error);
});