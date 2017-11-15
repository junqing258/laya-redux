
let curSense, curRouter, routerList = [], componentList = [];
export default class SenseManager {
    
    static reg(list) {
        list.forEach((v, i)=> {
            routerList[i] = v.router;
            let component = v.component;
            if (!component.getInstance) {
                component.getInstance = function() {
                    if (!component.instance) component.instance = new component();
                    return component.instance;
                }
            }
            componentList[i] = component;
        });
    }

    static loadSense(router, payload, props) {
        let index = routerList.indexOf(router);
        if (index===-1) return console.warn(`${router} not registered`);
        if (curRouter&&!curSense.actived) return console.warn(`${curRouter} not actived`);
        let preSense,
            preProto = componentList[index].prototype;
        preProto.actived = false;
        let promise;
        if (typeof preProto.willMount === "function") promise = preProto.willMount();
        if (typeof preProto.getAsset === "function" && !preProto.hasLoaded) {
            let asset = preProto.getAsset();
            let promise2 = new Promise(resolve=> {
                Laya.loader.load(asset, Laya.Handler.create(null, ()=> {
                    preProto.hasLoaded = true;
                    resolve();
                }));
            });
            if (promise instanceof Promise) promise = Promise.all([promise, promise2]);
        }
        if (promise instanceof Promise) {
            // tiploadding.show();
            promise.then(value=> {
                preSense = componentList[index].getInstance();
                if (curRouter) Laya.timer.frameOnce(1, curSense, curSense.destroy);
                Laya.stage.addChildAt(preSense, 0);
                curRouter = router;
                curSense = preSense;
                curSense.actived = true;
            });
        } else {
            preSense = componentList[index].getInstance();
            if (curRouter) Laya.timer.frameOnce(1, curSense, curSense.destroy);
            Laya.stage.addChildAt(preSense, 0);
            curRouter = router;
            curSense = preSense;
            curSense.actived = true;
        }
    }

    static getCurSense() {

    }

    static goBack() {

    }

} 