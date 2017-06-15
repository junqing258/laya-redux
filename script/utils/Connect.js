
import { uuid, getIn } from './util';
/*export class Basecomponent {

	_state = null;

	onStateChange() {

	} 

}*/


export function Connect(path, component, bindState) {
	/*var i = path.indexOf(".");
	var module = path.substr(0, i);
	var pathIn = path.substring(i+1)
	var state = Connect.store[module];*/
	if (!Connect.subList[path]) { 
		Connect.subList[path] = [component];
	} else {
		Connect.subList[path].push(component);
	}
	// Connect.subList[path] = component;
	bindState && (component.bindState = bindState) ;
	if (typeof component.bindState === "function") {
		var paths = path.split(".");
		var _state = getIn(Connect.store, path);
		component.state = _state;
		component.bindState.call(component, _state);
	}
	
}

Connect.subList = {};

Connect.initStore = store => {
	Connect.store = store;
	var unsubscribe = store.subscribe(() => {
		Object.keys(Connect.subList).forEach(function(path, i) {
			var components = Connect.subList[path];
			components.forEach(function(component, i) {
				var _state = getIn(Connect.store, path);
				if (component.state !== _state) {
					component.state = _state;
					component.bindState.call(component, _state);
				}
			});
		});
	});
}