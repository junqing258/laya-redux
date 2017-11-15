

export function instance(target) {
   target.constructor.getInstance = function() {
   		if (!target.constructor.instance) target.constructor.instance = new target();
   		return target.constructor.instance;
   }
}

export function login(target, key, descriptor) {
	let c = target[key];
	target.constructor.prototype[key] = function(...args) {
		if (true) console.log("login");
		c(...args);
	}
}