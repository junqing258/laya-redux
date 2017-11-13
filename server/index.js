// var express = require("express");
var fs = require("fs");
var http = require("http");
var Primus = require("primus");
var CryptoJS = require("crypto-js");

let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIyMDM3NTk5OTE2IiwiZXhwIjoxNTEyNjE0MDM4fQ.8xMkEfJ-24uld5OZqe9NAdAhuGxup3MiZy7yhULcwss";
let publicKey= "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvMCkMUkh7AJqwUAecmgHZwQbiR4u7ZdOhuzoxZEhAZUjrBarfHvttwfKLFM1r2uXvuu2rrYKjpa1iUV2A4rLeHlPnT07IeelAFiUKbjOaqS1K1ByTjIFCz466B8bMRYIOA6Za5j4OcVaQvpgXWZicshHssLFCeYnj2f5XAYQFiS9It6lJ0gGJWT2YSD6WxMAV1JRCpLJE0rtV5egAqAp9UImsZDjE2mVHXCTjlQKsdi+8jRJatZFLwDqOU0RGlgmwcjdg6u511xWWaQX1G3IhSMRAjrY4FDxxYRKBGrkNBPAp34NodGWL1iEHD+GdR3wRvbIAnLNU0XDf2bEenMPzwIDAQAB";

module.exports = function() {
	// var app = express();
	var server = http.createServer(/*app*/);
	var primus = Primus(server);

	server.listen(3000, function() {
	  console.log('listening on *:3000');
	});

	primus.on('open', function (data) {
	    console.log("连接成功", data);
	});
	let encryptedString;
	primus.on('connection', function(spark) {
		spark.emit("incoming::open");
		spark.on('data', function(data) {
			/*if (!encryptedString) {
				var public_key = new Rsa(spark.query.login);
				public_key.setOptions({encryptionScheme: 'pkcs1'});
				encryptedString = public_key.encrypt(text, 'utf8');
				console.log(spark.query.login);
			}*/
			let commonKey = spark.query.login;
			let decryptstr = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(commonKey), {
	            mode: CryptoJS.mode.ECB,
	            padding: CryptoJS.pad.Pkcs7
	        });
	        let dataString = decryptstr.toString(CryptoJS.enc.Utf8);
	        let parsedData;
            parsedData = JSON.parse(dataString);
			console.log('received data:', parsedData);
			fs.readFile('bin/json/test1.json','utf8',function (err, data) {
		        if(err) console.log(err);
		        let jsonObj =JSON.parse(data);
		        spark.write(jsonObj);
			});
		});
	});
	primus.on('data', function (data) {
	    console.log("on data:", data);
	});

};