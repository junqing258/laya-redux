
export function uuid() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
}

export function getIn(store, path) {
	var paths = path.split(".");
	var obj = store.getState();
	paths.forEach(function(param, i) {
		obj = obj[param]
	});
	return obj;
}

export function random(max, min) {
	min = min || 0;
	return min + Math.round(Math.random() * (max-min));
}