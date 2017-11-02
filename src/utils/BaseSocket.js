
(function() {
    var util = ddt.util;

    var logStyl = {
        hall: "#8C8801",
        fight: "#296409"
    };

    function BaseSokect (options) {
        this.__super.call(this);
        this.primus = null;
        this.data = {
            _commKey       : null,  //res加密公钥所用到的key
            token          : null,  //玩家token，在连接初始化时用于res生成公钥
            jwtToken       : null,  //res加密之后的玩家token，数据交互以此token为主
            publicKey      : null,  //res公钥   
            connectionUrl  : null,  //连接url
            encryptedString: null,  //res加密后的验证字符串
            isOpened       : false  //连接是否已经初始化过
        };
        Object.assign(this.data, options);
        this.init();
    }
    Laya.class(BaseSokect, "ddt.BaseSokect", Laya.EventDispatcher);
    var _proto_ = BaseSokect.prototype;

    _proto_.init = function() {
        var self = this;
        if (self.inited) { return; }
        self.generateCommKey();
        self.generateEncryptedString();
        self.inited = true;
    };

    _proto_.setUrl = function(url) {
      this.data.connectionUrl = url;
    };

    _proto_.connect = function() {
        var self = this;
        var primus;
        try {
            primus = this.primus = Primus.connect(self.data.connectionUrl);
            primus.on('outgoing::url', function (url) {
                url.query = 'login=' + self.data.encryptedString;
            });
            primus.on('open', function () {
                self.online = true;
                console.log("连接成功", self.data.connectionUrl);
                self.event("onOpen");
                
                if (self.initedCont) { return; }
                self.initedCont = true;

            });

            primus.on('data', function (data) {
                self.onData(data);
            });
            primus.on('error', function (data) {
                self.online = false;
                console.log("连接出错", self.data.connectionUrl);
                self.event("onError", data);
            });
            primus.on('reconnect', function () {
                console.log("重连中", self.data.connectionUrl);
                self.event("onReconnect");
            });
            primus.on('disconnect', function () {
                self.online = false;
                console.log("连接断开", self.data.connectionUrl);
                self.event("onDisconnect");

                ddt.popCtrl.dispatcher.event('popRefresh', [
                    'show',
                    {content: '连接已关闭, 请刷新页面'}
                ]);
            });
            primus.on('end', function () {
                self.online = false;
                console.log("连接已关闭", self.data.connectionUrl);
                self.event("onEnd");
                
            });
            

        } catch (e) {
            self.primus = null;
            console.log(e);
        }

        self.primus = primus;
    };

    _proto_.onData = function(data) {
        var self = this;
        //解密
        var decryptstr = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(self.data._commKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        var dataString = decryptstr.toString(CryptoJS.enc.Utf8);
        var parsedData;
        try {
            parsedData = JSON.parse(dataString);
        } catch(e) {
            console.log(data);
            console.log(dataString);
            console.warn(e);
            return;
        }
        
        var _color = logStyl[self.data.type] || "green";
        util.log("%c ↓ "+parsedData.cmd, "color:"+_color, parsedData["rep"]||parsedData);

        //更新jwt token
        if (parsedData.cmd == self.cmd.CONN_INIT) {
            self.data.jwtToken = parsedData.rep;
        } else {
            self.event(parsedData.cmd, parsedData.rep);
        }

        switch( parsedData.cmd ){
            case 'conn::error':
                if( parsedData.res && parsedData.res.code == 1003 ){
                    self.disconnect();
                    ddt.popCtrl.dispatcher.event('popRefresh', [
                        'show',
                        {content: '异地登录, 请刷新页面'}
                    ]);
                }
                break;
            case 'error':
                /*
                    假设推送命令 "gameIn" 发生异常了,
                    那么界面上可以接收 "gameIn_error" 来处理异常
                */
                if( parsedData.rep && parsedData.rep.cmd ){
                    self.event(parsedData.rep.cmd + '_error', parsedData.rep);
                }
                break;
        }
    };

    _proto_.emit = function(data) {
        var self = this;
        //为data增加token
        if (data.params) {
            data.params.token = self.data.jwtToken;
        } else {
            data.params = {token: self.data.jwtToken};
        }
        
        if (util.env=="local") {
            dev_userId && (data.params.userId = dev_userId);
            dev_roleId && (data.params.roleId = dev_roleId);
        }else if (util.env=="dev") {
            dev_userId && (data.params.userId = dev_userId);
            ddt.GameData && ddt.GameData.data.userInfo.roleId && (data.params.roleId = ddt.GameData.data.userInfo.roleId);
        }

        data.status = {time: new Date().getTime()};

        util.log("%c ↑ "+data["cmd"], "color:blue", JSON.stringify(data), self.data.type);
        //加密
        var encryptData = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(self.data._commKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        //发送加密数据
        self.primus.write(encryptData.toString());
    };

    _proto_.post = function (cmd, params) {
        // if (callback) { registedAction[cmd] = callback;   }
        this.emit({cmd: cmd, params: params});
    };

    _proto_.onAction = function(cmd, listener, caller) {
        //self.event(parsedData.cmd, parsedData.rep);
        caller = caller || this;
        this.on(cmd, caller, listener);
        return {
            'cmd' : cmd,
            'caller' : caller,
            'listener' : listener
        }; 
    };


    _proto_.offAction = function (object) {
        if (typeof object=== 'string') { 
            this.offAll(object);
        } else if(object && Object.keys(object).length!=0 ) {
            this.off(object.cmd, object.caller, object.listener);
        }
    };

    _proto_.on = function(cmd, caller, listener) {
        var listenerSign = {cmd:cmd, caller: caller, listener: listener};
        this.__super.prototype.on.apply(this, arguments);
        return listenerSign;
    };

    _proto_.disconnect = function() {
        this.primus && this.primus.end();
    };

    //生成commkey
    _proto_.generateCommKey = function () {
        try {
            this.keyCount = this.keyCount? this.keyCount+1: 0;
            // console.log("初始化可以次数", this.keyCount);
            this.data._commKey = Date.parse(new Date()).toString() + Date.parse(new Date()).toString() + Date.parse(new Date()).toString().substring(0, 6);
    } catch (e) {
            console.log("初始化commKey失败", e);
        }
    };

    //生成encryptedString
    _proto_.generateEncryptedString = function () {
        var self = this;
        try {
            var params = "jwt=" + self.data.token + "&commKey=" + self.data._commKey;
            var jsencrypt = new JSEncrypt();
            jsencrypt.setPublicKey(self.data.publicKey);
            self.data.encryptedString = jsencrypt.encrypt(params);
        } catch (e) {
            console.log("初始化encryptedString失败", e);
        }
    };




})();