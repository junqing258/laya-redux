

export function instance(target) {
   target.getInstance = function() {
   		if (!target.instance||target.instance.destroyed) target.instance = new target();
   		return target.instance;
   }
}
export let PopupCofig = {
	onloadding: function() {},
	onloaded: function() {}
};
export function popup(target) {
	target.getInstance = function() {
		if (target.getAsset && !target.hasLoaded) {
            let asset = target.getAsset();
            target.instance = {};
            target.instance.popup = ()=> {
				PopupCofig.onloadding();
                Laya.loader.load(asset, Laya.Handler.create(null, ()=> {
                    target.hasLoaded = true;
                    target.instance = new target();
					PopupCofig.onloaded();
                    target.instance.popup();
                }));
            };
			target.instance.show = ()=> {
                Laya.loader.load(asset, Laya.Handler.create(null, ()=> {
                    target.hasLoaded = true;
                    target.instance = new target();
                    target.instance.show();
                }));
            };
        } else if (!target.instance || target.instance.destroyed) target.instance = new target();
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