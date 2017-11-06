import ShimoSokect from "../utils/ShimoSokect";

setTimeout(function() {

	var sokect = new ShimoSokect({
		"connectionUrl": "http://127.0.0.1:3000"
	});
	sokect.connect();

}, 1000);