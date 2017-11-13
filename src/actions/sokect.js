import ShimoSokect from "../utils/ShimoSokect";

setTimeout(function() {

	var sokect = new ShimoSokect({
		"connectionUrl": "http://127.0.0.1:3000",
		"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIyMDM3NTk5OTE2IiwiZXhwIjoxNTEyNjE0MDM4fQ.8xMkEfJ-24uld5OZqe9NAdAhuGxup3MiZy7yhULcwss",
		"publicKey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvMCkMUkh7AJqwUAecmgHZwQbiR4u7ZdOhuzoxZEhAZUjrBarfHvttwfKLFM1r2uXvuu2rrYKjpa1iUV2A4rLeHlPnT07IeelAFiUKbjOaqS1K1ByTjIFCz466B8bMRYIOA6Za5j4OcVaQvpgXWZicshHssLFCeYnj2f5XAYQFiS9It6lJ0gGJWT2YSD6WxMAV1JRCpLJE0rtV5egAqAp9UImsZDjE2mVHXCTjlQKsdi+8jRJatZFLwDqOU0RGlgmwcjdg6u511xWWaQX1G3IhSMRAjrY4FDxxYRKBGrkNBPAp34NodGWL1iEHD+GdR3wRvbIAnLNU0XDf2bEenMPzwIDAQAB"

	});
	sokect.connect();

	sokect.send({a:123});

}, 1000);