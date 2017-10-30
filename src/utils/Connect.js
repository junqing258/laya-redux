var subMap = {}, comStateTarget = {};
var gid = 0;

export default function Connect(path, component, bindState, order) {
	order = (order || "D").toUpperCase();
	let pathName = path/*.replace(/\./g, "_")*/;

	if (!subMap[pathName]) subMap[pathName] = {};
	if (!component.uuid) {
		let uid = order+(gid++);
		component.uuid = uid;
		component.state = {};
		component.preState = {};
		component.bindState = {};
	}

	let _state = getIn(path, Connect.store);
	subMap[pathName][component.uuid] = component;
	if (typeof bindState === "function") {
		component.bindState[pathName] = bindState;
		bindState(_state, undefined); 
	}
	component.state[pathName] = comStateTarget[pathName] = _state;
}


export function provider(store) {
	if (Connect.store) { console.warn("store be used"); }
	Connect.store = store;
	Connect.unsubscribe = store.subscribe(() => {
		Object.keys(subMap).forEach( path => {
			let pathName = path/*.replace(/\./g, "_")*/;
			let _state = getIn(pathName, Connect.store);
			if (comStateTarget[pathName] === _state) return;
			Object.keys(subMap[pathName]).forEach( uuid => {
				let component = subMap[pathName][uuid];
				if (!component||component.destroyed) return delete subMap[pathName][uuid];
				let bindState = component.bindState[pathName];
				if (typeof bindState === "function") bindState(_state, component.state[pathName]);
				component.preState[pathName] = component.state[pathName];
				component.state[pathName] = _state;
			});
			comStateTarget[pathName] = _state;
		});
	});
};



export function getIn (path, store) {
	store = store || Connect.store;
	if (typeof path!== "string") {
		let t = store;
		store = path;
		path = t;
	}
	var paths = path.split('.');
	var obj = typeof store.getState === "function"? store.getState(): store;
	for (let i = 0,len = paths.length; i < len; i++) {
	  obj = obj[paths[i]];
	  if (obj === undefined) break;
	}
	return obj;
}
