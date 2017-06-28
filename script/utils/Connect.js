
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

Connect.provider = store => {
	if (Connect.store) { console.warn("store be used"); }
	Connect.store = store;
	var unsubscribe = store.subscribe(() => {
		Object.keys(subList).forEach( path => {
			Object.keys(subList[path]).forEach( uuid => {
				let component = subList[path][uuid];
				let _state = getIn(Connect.store, path);
				if (component.displayedInStage===false || component.destroyed) {
					return delete subList[path][uuid];
				}
				if (component.state !== _state) {
					if (typeof component.bindState === "function") { component.bindState(_state); }
					component.state = _state;
				}
			});
		});
	});
};
