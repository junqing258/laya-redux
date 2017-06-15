
import { uuid, getIn } from './util';


var subList = {};

export function Connect(path, component, bindState) {
	/*var i = path.indexOf(".");
	var module = path.substr(0, i);
	var pathIn = path.substring(i+1)
	var state = Connect.store[module];*/
	if (!subList[path]) { 
		subList[path] = [component];
	} else {
		subList[path].push(component);
	}

	bindState && (component.bindState = bindState) ;
	if (typeof component.bindState === "function") {
		var paths = path.split(".");
		var _state = getIn(Connect.store, path);
		component.state = _state;
		component.bindState.call(component, _state);
	}
	
}


Connect.use = store => {
	Connect.store = store;
	var unsubscribe = store.subscribe(() => {
		Object.keys(subList).forEach(function(path, i) {
			var components = subList[path];
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