var M = {}, comStateTarget = {}, T = {}, KS = [];
var gid = 0;
/**
 *
 * @param {string} path
 * @param {object} component
 * @param {function} bindState
 * @param {boolean} once
 * @param {string} order
 */
export default function connect(path, component, bindState, order) {
	order = (order || "D").toUpperCase();
	let pathName = path/*.replace(/\./g, "_")*/;
	if (!M[pathName]) M[pathName] = {};
	if (!component.uuid) Object.assign(component, {
		uuid: order + (gid++),
		reduxState: {},
		reduxPreState: {},
		bindState: {}
	});
	let _state = getIn(path, T.store);
	M[pathName][component.uuid] = component;
	if (typeof bindState === "function") {
		component.bindState[pathName] = bindState;
		bindState(_state, undefined);
	}
	component.reduxState[pathName] = comStateTarget[pathName] = _state;
	KS = Object.keys(M);
}


export function provider(store) {
	if (T.store) { console.warn("store be used"); }
	T.store = store;
	T.unsubscribe = store.subscribe(() => {
		KS.forEach(path => {
			let pathName = path/*.replace(/\./g, "_")*/;
			let _state = getIn(pathName, T.store);
			if (comStateTarget[pathName] === _state) return;
			comStateTarget[pathName] = _state;
			Object.keys(M[pathName]).forEach( uuid => {
				let component = M[pathName][uuid];
				if (!component || component.destroyed) return delete M[pathName][uuid];
				let bindState = component.bindState[pathName];
				if (typeof bindState === "function") bindState(_state, component.reduxState[pathName]);
				component.reduxPreState[pathName] = component.reduxState[pathName];
				component.reduxState[pathName] = _state;
			});
		});
	});
};



export function getIn(path, store) {
	store = store || T.store;
	if (typeof path !== "string") {
		let t = store;
		store = path;
		path = t;
	}
	var paths = path.split('.');
	var obj = typeof store.getState === "function" ? store.getState() : store;
	for (let i = 0, len = paths.length; i < len; i++) {
		obj = obj[paths[i]];
		if (obj === undefined) break;
	}
	return obj;
}
