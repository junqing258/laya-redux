/**
 * @description SenseManager
 */
(function () {

    var Stage   = Laya.Stage;
    var Loader  = Laya.Loader;
    var Handler = Laya.Handler;
    var Event   = Laya.Event;
    var EventDispatcher = Laya.EventDispatcher;


    var SenseManager = ddt.SenseManager = {};

    SenseManager.cursense   = null;
    SenseManager.senseMap   = {};
    SenseManager.notHistory = [];

    var senseDispatcher   = SenseManager.senseDispatcher   = new EventDispatcher();
    var TRIGER_ENTERSENSE = SenseManager.TRIGER_ENTERSENSE = 'TRIGER_ENTERSENSE';
    var TRIGER_EXITSENSE  = SenseManager.TRIGER_EXITSENSE  = 'TRIGER_EXITSENSE';

    SenseManager.loadSense = function (routeToken, payload, params) {
        var cursense = this.cursense, obj = null;
        if (typeof routeToken !== 'string') {
            obj = routeToken.getInstance();
            routeToken = obj.routeToken;
        }
        if (!SenseManager.firstLoaded) {
            SenseManager.firstLoaded = true; 
        }

        if (!this.senseMap[routeToken]) { return console.warn("sense没有注册"); }

        var arsh  = routeToken.split('::');
        var _hash = arsh[0];
        var _isub = (arsh.length > 1);

        SenseManager.nextSense = _hash;        
        if (!cursense) {
            senseDispatcher.event(TRIGER_ENTERSENSE, _hash);
        } else if (cursense !== routeToken) {  // changSense
            var nextSense = routeToken;
            
            var curSenseObj = this.senseMap[cursense],
                nextSenseObj = this.senseMap[nextSense];

            if (curSenseObj.lifecycle !== 'onLoad') {
               return console.warn(cursense + '没有加载完');
            }
            nextSenseObj.payload = payload;

            senseDispatcher.event(TRIGER_EXITSENSE, cursense);
            setTimeout(function() {
                senseDispatcher.event(TRIGER_ENTERSENSE, nextSense);
                if (params && params.isBack) {
                    SenseManager.history.pop();
                } else if (SenseManager.notHistory.indexOf(cursense)=== -1) {   //SenseManager.notHistory.push(routeToken);
                    SenseManager.history = SenseManager.history || [];
                    SenseManager.history.push(cursense);
                    (SenseManager.history.length > 50) && (SenseManager.history.shift());
                }
            }, 0);
            
        }
        this.cursense = routeToken;
    };

    SenseManager.registerSense = function (sense, router) {
        this.senseMap[router] = sense;
    };

    SenseManager.reg = function(objmap) {
        objmap.forEach(function(v, i) {
            SenseManager.registerSense(v, v.routeToken);
        });
    };

    SenseManager.getSense = function(router) {
        return this.senseMap[router];
    };

    SenseManager.getCurSenseRounter = function() {
        return this.cursense;
    };

    SenseManager.getCurrentSense = function() {
        return this.senseMap[this.cursense];
    };

    SenseManager.getNextSenseRounter = function() {
        return this.nextSense;
    };

    SenseManager.getNextSense = function() {
        return this.senseMap[this.nextSense || ""];
    };
    
    SenseManager.inHistory = function(router) {
        return SenseManager.notHistory.indexOf(router)=== -1
    }

    SenseManager.goBack = function() {
        if (SenseManager.history && SenseManager.history.length >= 1) {
            var _last = SenseManager.history[SenseManager.history.length - 1];
            if (_last === SenseManager.getCurSenseRounter()) {
                SenseManager.history.pop();
                return SenseManager.goBack();
            }
            SenseManager.loadSense(_last, null, {isBack: true});
        } else {
            SenseManager.loadSense("#/hall");
        }
    };

    SenseManager.setHash = function(router) {
        SenseManager.loadFlag = true;
        location.hash = router;
        setTimeout(function() {
            SenseManager.loadFlag = false;
        }, 60);
    };


    // window.history.pushState(null, null, "#/b");
    /*window.onpopstate = function (event) {
        var hash = document.location.hash;
        if (!hash) {
            if (window.confirm("点击确认将退出应用")) {
                history.go(-1);
            } else {
                window.history.pushState(null, null, "#/b");
            }
        }
    };*/

    ddt.reloadFlag = false;
    ddt.reLoad = function() {
        ddt.reloadFlag = true;
        location.reload();
    };
    ddt.goUrl = function(url) {
         ddt.reloadFlag = true;
        location.href = url;
    };


    location.hash = "";
    SenseManager.loadFlag = false;
    window.addEventListener("hashchange", function(e) {
        if (SenseManager.loadFlag) { return; }
        var hash = document.location.hash;
        if (SenseManager.getCurSenseRounter() === "#/fight") {
            if (ddt.FightData.data.isReplay) { return; }
            var settingPop = new ddt.SettingPop(null, function() {
                SenseManager.setHash('/fight');
            });
            settingPop.show();
        } else if (hash && SenseManager.inHistory(hash)) {
            SenseManager.loadSense(hash);
        }
    });


    // Path.listen();

})();

/***
 * *********************************************************************************************************************************************************************
 * @description BaseSense.js
 *
 */
(function () {

    var EventDispatcher = laya.events.EventDispatcher;

    var SenseManager = ddt.SenseManager;

    var senseDispatcher = SenseManager.senseDispatcher;
    var TRIGER_ENTERSENSE = SenseManager.TRIGER_ENTERSENSE;
    var TRIGER_EXITSENSE = SenseManager.TRIGER_EXITSENSE;

    function BaseSense(routeToken, params) {
        if (SenseManager.senseMap[routeToken]) { 
            console.warn(routeToken+"已经实例化");
            return SenseManager.senseMap[routeToken]; 
        }
        var self = this;
        this.routeToken = routeToken;
        this.payload = undefined;
        if (params && params.history === false) { SenseManager.notHistory.push(routeToken); }
        this.lifeDispathcer = new EventDispatcher();
        this.lifecycle = 'pending';
        if (typeof this.init === 'function') { 
            this.init(); 
        }
        
       /* 
        this.route = Path.map(this.routeToken)
            .enter(function() {
                self._enterAction();
            })
            .to(function() {
                self._toAction();
            })
            .exit(function() {
                self._exitAction();
            });
        */

        senseDispatcher.on(TRIGER_ENTERSENSE, self, function () {
            if (arguments[0] === self.routeToken || arguments === self.routeToken) {
                if (SenseManager.inHistory(self.routeToken)) {
                    SenseManager.setHash(self.routeToken);
                } else {
                    console.log(self.routeToken);
                }
                self._toAction.call(self);
            }
        });

        senseDispatcher.on(TRIGER_EXITSENSE, self, function () {
            if (arguments[0] === self.routeToken || arguments === self.routeToken) {
                self._exitAction.call(self);
            }
        });


    }
    Laya.class(BaseSense, "ddt.BaseSense");
    var _proto = BaseSense.prototype;

    _proto.getInstance = function() {
      return this;
    };

    _proto._enterAction = function () {
        if (typeof this.willEnter === 'function') {
            console.warn("willEnter舍弃了");
            this.willEnter();
        }
        this.lifecycle = 'willEnter';
        this.lifeDispathcer.event('willEnter');
    }

    _proto._toAction = function () {
        var self = this;
        SenseManager.cursense = self.routeToken;

        this.lifecycle = 'berforeLoad';
        this.lifeDispathcer.event('berforeLoad');
        
        if (typeof this.berforeLoad === 'function') {
            var promise = this.preloadPromise || this.berforeLoad();
            if (promise && promise instanceof Promise) {
                promise.then(function (value) {
                    self._onLoad();
                });
            } else {
                this._onLoad();
            }
        } else {
            this._onLoad();
        }
        this.preloadPromise = null;
    };

    _proto._onLoad = function () {
        if (typeof this.onLoad === 'function') {
            SenseManager.isSubpage = (location.hash !== this.routeToken);
            this.onLoad();
        } else {
            console.warn("sense OnLoad没有申明");
        }
        // SenseManager.nextSense = null;
        this.lifecycle = 'onLoad';
        this.lifeDispathcer.event('onLoad');
    };

    _proto._exitAction = function () {
        if (!this.lifecycle || this.lifecycle === 'pending') { return; }
        // var nextSense
        if (typeof this.willExit === 'function') {
            var self = this;
            var promise = this.willExit();
            if (promise && promise instanceof Promise) {
                promise.then(function (value) {
                    self._toNext();
                });
            } else {
                this._toNext();
            }
            // SenseManager.nextSense = this.routeToken;
            this.lifecycle = 'willExit';
            this.lifeDispathcer.event('willExit');
            console.log(this.routeToken+"willExit");
        } else {
            this._toNext();
        }
    };

    _proto._toNext = function() {
        var self = this;
        var nextSense = SenseManager.getNextSense();
        
        if (typeof nextSense.berforeLoad === 'function') {
            var promise = nextSense.berforeLoad();
            nextSense.preloadPromise = promise;
            if (promise && promise instanceof Promise) {
                if (SenseManager.notHistory.indexOf(nextSense.routeToken)=== -1) {
                    ddt.TipLoadding.show();
                    nextSense.lifeDispathcer.once("onLoad", nextSense, ddt.TipLoadding.hide.bind(ddt.TipLoadding));
                }
                promise.then(function (value) {
                    self._onExit();
                });
            } else {
                this._onExit();
            }
        } else {
            this._onExit();
        }
    };

    _proto._onExit = function () {
        var self = this;
        var nextSense = SenseManager.nextSense;

        if (typeof this.onExit === 'function') {
            Laya.timer.frameOnce(1, null, function() {
                self.payload = null;
                self.onExit();
            });
        }
        
        if (ddt.util.env==="dev" || ddt.util.env==="local") {
            Laya.timer.frameOnce(5, null, function() {
                console.log('stage._childs: ', Laya.stage._childs);
            });
        }
        
        SenseManager.nextSense = null;
        this.lifecycle = 'onExit';
        this.lifeDispathcer.event('onExit');
    };

    _proto.on = function(type, caller, listener) {
        this.lifeDispathcer.on.call(this.lifeDispathcer, type, caller, listener);
        return { type:type, caller: caller, listener: listener };
    };

    _proto.off = function(listenerObj) {
        if (typeof listenerObj !== 'object' || Object.keys(listenerObj).length !==3) { throw new Error('listenerObj Error') }
        var type = listenerObj.type, caller=listenerObj.caller, listener=listenerObj.listener;
        this.lifeDispathcer.off.call(this.lifeDispathcer, type, caller, listener);
    };

})();