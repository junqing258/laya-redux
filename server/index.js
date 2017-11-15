// var express = require("express");
var fs = require("fs");
var http = require("http");
var Primus = require("primus");
var CryptoJS = require("crypto-js");
var Rsa = require("node-rsa");

let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIyMDM3NTk5OTE2IiwiZXhwIjoxNTEyNjE0MDM4fQ.8xMkEfJ-24uld5OZqe9NAdAhuGxup3MiZy7yhULcwss";
let publicKey= "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvMCkMUkh7AJqwUAecmgHZwQbiR4u7ZdOhuzoxZEhAZUjrBarfHvttwfKLFM1r2uXvuu2rrYKjpa1iUV2A4rLeHlPnT07IeelAFiUKbjOaqS1K1ByTjIFCz466B8bMRYIOA6Za5j4OcVaQvpgXWZicshHssLFCeYnj2f5XAYQFiS9It6lJ0gGJWT2YSD6WxMAV1JRCpLJE0rtV5egAqAp9UImsZDjE2mVHXCTjlQKsdi+8jRJatZFLwDqOU0RGlgmwcjdg6u511xWWaQX1G3IhSMRAjrY4FDxxYRKBGrkNBPAp34NodGWL1iEHD+GdR3wRvbIAnLNU0XDf2bEenMPzwIDAQAB";

module.exports = function() {
	// var app = express();
	let server = http.createServer(/*app*/);
	let primus = Primus(server);
	let encryptedString, commonKey;

	server.listen(3000, ()=> console.log('listening on *:3000'));
	primus.on('open', data=> console.log("连接成功", data));
	
	primus.on('connection', function(spark) {
		spark.emit("incoming::open");
		spark.on('data', function(data) {
			commonKey = spark.query.login;
	        let parsedData = decryptDataFunc(data);
			console.log('received data:', parsedData);
	        let cmd = parsedData.cmd || "conn::error";
			fs.readFile(`server/data/${cmd}.json`,'utf8', (err, data)=> {
				let jsonObj;
		        if(err) cmd = "conn::error", jsonObj = { "statusCode": "0000",  "msg": "SYS_ERROR" };
	        	else jsonObj =JSON.parse(data);
		        spark.write(encryptDataFunc({cmd: cmd, rep: jsonObj}));
			});
		});
	});
	
	function encryptDataFunc(jsonObj) {
		var encryptData = CryptoJS.AES.encrypt(JSON.stringify(jsonObj), CryptoJS.enc.Utf8.parse(commonKey), {
		    mode: CryptoJS.mode.ECB,
		    padding: CryptoJS.pad.Pkcs7
		});
		return encryptData.toString();
	}
	
	function decryptDataFunc(data) {
		let decryptstr = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(commonKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        let dataString = decryptstr.toString(CryptoJS.enc.Utf8);
        return JSON.parse(dataString);
	}

};


