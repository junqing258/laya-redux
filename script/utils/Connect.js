
import { uuid, getIn } from './util';


var subList = {};
export default function Connect(path, component, bindState) {
	if (!component.uuid) { component.uuid = uuid(); }
	if (!subList[path]) {  subList[path] = {}; } 
	subList[path][component.uuid] = component;

	bindState && (component.bindState = bindState) ;
	
	var _state = getIn(Connect.store, path);
	component.state = _state;
	if (typeof component.bindState === "function") { component.bindState(_state); }
}

Connect.use = store => {
	if (Connect.store) { console.warn("store be used"); }
	Connect.store = store;
	var unsubscribe = store.subscribe(() => {
		Object.keys(subList).forEach(function(path, i) {
			Object.keys(subList[path]).forEach(function(uuid, i) {
				let component = subList[path][uuid];
				var _state = getIn(Connect.store, path);
				if (component.displayedInStage===false || component.destroyed) {
					delete subList[path][uuid];
					return;
				}
				if (component.state !== _state) {
					component.state = _state;
					if (typeof component.bindState === "function") { component.bindState(_state); }
				}
			});
		});
	});
};
