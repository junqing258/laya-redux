var Primus = require('primus'),
	http = require('http');

var server = http.createServer( /* request handler */ ),
	primus = new Primus(server, {
		port: 443
	});

primus.on('connection', function(spark) {
	spark.write('hello connnection');
});