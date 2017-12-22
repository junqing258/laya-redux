var M = {}, comStateTarget = {}, T = {}, KS = [];
var gid = 0;
/**
 * @param {string} path
 * @param {object} component
 * @param {function} bindState
 * @param {string} order
 */
export default function connect(path, component, bindState, order) {
	order = (order || "D").toUpperCase();
	let pathName = path/*.replace(/\./g, "_")*/;
	if (!M[pathName]) M[pathName] = {};

	if (!component.reduxid) {
		Object.assign(component, {
			reduxid: order + (gid++),
			reduxState: {},
			reduxPreState: {},
			bindState: {}
		});
		let destroyFun = component.destroy || function() {};
		component.destroy = function() {
			delete M[pathName][component.reduxid];
			KS = Object.keys(M);
			component.reduxid = null;
			destroyFun.apply(component, arguments);
		};
	}

	let _state = getIn(path, T.store);
	M[pathName][component.reduxid] = component;
	if (typeof bindState === "function") {
		component.bindState[pathName] = bindState;
		let _prestate = comStateTarget[pathName] || getIn(pathName);
		bindState(_state, _prestate);
	}
	comStateTarget[pathName] = _state;
	if (component && !component.destroyed) component.reduxState[pathName] = _state;
	KS = Object.keys(M);
}


export function provider(store) {
	if (T.store) { console.warn("store be used"); }
	T.store = store;
	T.unsubscribe = store.subscribe(() => {
		KS.forEach(pathName => {
			let _state = getIn(pathName, T.store),
				_prestate = comStateTarget[pathName];
			if (_prestate === _state) return;
			comStateTarget[pathName] = _state;
			Object.keys(M[pathName]).forEach( reduxid => {
				let component = M[pathName][reduxid];
				if (!component || component.destroyed) return delete M[pathName][reduxid], component=null;
				let bindState = component.bindState[pathName];
				if (typeof bindState === "function") bindState(_state, _prestate);
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
	var paths = path.split(".");
	var obj = typeof store.getState === "function" ? store.getState() : store;
	for (let i = 0, len = paths.length; i < len; i++) {
		obj = obj[paths[i]];
		if (obj === undefined || obj === null) break;
	}
	return obj;
}


/*export function createAction(actionType, payloadCreator, metaCreator) {
	return function(...args) {
		return { type: actionType,  payload: payload };
		return (dispatch, getState) => {

		};
	};
}*/