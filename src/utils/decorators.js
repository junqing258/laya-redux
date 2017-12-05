

export function instance(target) {
   target.getInstance = function() {
   		if (!target.instance||target.instance.destroyed) target.instance = new target();
   		return target.instance;
   }
}

export function login(target, property, decorators, descriptor, context) {
	let func = target[property];
	return function() {
		console.log("login");
		return func.apply(this, arguments);
	}
}