import ShimoSokect from "../utils/ShimoSokect";


var sokect = new ShimoSokect({
	"connectionUrl": "http://127.0.0.1:3000",
	"token": "",
	"publicKey": publicKey

});
sokect.connect();

setTimeout(function() {
	sokect.send("test2", {a:123});
	sokect.send("test5", {a:123});
}, 1000);