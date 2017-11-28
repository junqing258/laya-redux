
let curSense, curRouter, routerList = [], componentList = [], hisRouters = [], lockedHash = true;
export default class SenseManager {
    
    static reg(list) {
        list.forEach((v, i)=> {
            routerList[i] = v.router;
            let component = v.component;
            if (!component.getInstance) {
                component.getInstance = function() {
                    if (!component.instance||component.instance.destroyed) component.instance = new component();
                    return component.instance;
                }
            }
            componentList[i] = component;
        });
    }

    static loadSense(router, payload, props) {
        let index = routerList.indexOf(router);
        if (index===-1) return console.warn(`${router} not registered`);
        if (curRouter && !curSense.actived) return console.warn(`${curRouter} not actived`);
        let preSense,
            preProto = componentList[index].prototype;
        preProto.actived = false;
        lockedHash = true;
        let promiselist = [];
        if (curRouter && typeof curSense.willUnMount === "function") {
            let p1 = curSense.willUnMount();
            if (p1 instanceof Promise) promiselist.push(p1);
        };
        if (typeof preProto.willMount === "function") {
            let p2 =  preProto.willMount();
            if (p2 instanceof Promise) promiselist.push(p2);
        }
        if (typeof preProto.getAsset === "function" && !preProto.hasLoaded) {
            let asset = preProto.getAsset();
            if (Array.isArray(asset) && asset.length>0) {
                let p3 = new Promise(resolve=> {
                    Laya.loader.load(asset, Laya.Handler.create(null, ()=> {
                        preProto.hasLoaded = true;
                        resolve();
                    }));
                });
                promiselist.push(p3);
            }
        }
        if (promiselist.length>0) {
            // tiploadding.show();
            Promise.all(promiselist).then(value=> {
                this.changeSense(router);
            });
        } else {
            this.changeSense(router);
        }
    }

    static changeSense(router) {
        let index = routerList.indexOf(router);
        let PrComponent = componentList[index];
        let preSense = PrComponent.getInstance();
        let hasHased = PrComponent.hasHased;
        if (curRouter) {
            Laya.timer.frameOnce(1, preSense, ()=> {
                if (hasHased) this.pushHistory(curRouter);
                curSense.destroy();
                curRouter = router;
                curSense = preSense;
                curSense.actived = true;
            });
        } else {
            curRouter = router;
            curSense = preSense;
            curSense.actived = true;
        }
        if (hasHased) location.hash = router;
        setTimeout(()=> lockedHash = false, 110);
        Laya.stage.addChildAt(preSense, 0);
    }

    static getCurSense() {
        return curSense;
    }

    static goBack() {
        let router = hisRouters.shift();
        if (router) this.loadSense(router);
    }

    static pushHistory(router) {
        if (hisRouters.length>=20) hisRouters.shift();
        if (router) hisRouters.push(router);
    }

}

export function sense(router, hasHased) {
    return function(target) {
        let i = routerList.length;
        routerList[i] = router;
        let component = target;
        component.hasHased = hasHased===false? false: true;
        if (!component.getInstance) {
            component.getInstance = function() {
                if (!component.instance||component.instance.destroyed) component.instance = new component();
                return component.instance;
            }
        }
        componentList[i] = component;
    }
}

window.addEventListener("hashchange", function() {
    if (lockedHash) return;
    let hash = location.hash;
    if (hash!==curRouter) {
        SenseManager.loadSense(hash.slice(1));
    }
});