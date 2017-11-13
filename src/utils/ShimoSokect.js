
export default class ShimoSokect/* extends Laya.EventDispatcher */{
	
	constructor(props) {
		// super(props);
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
        Object.assign(this.data, props);
		this.init();
	}

	init() {
		if (this.inited) { return; }
        this.generateCommKey();
        this.generateEncryptedString();
        this.inited = true;
	}

	generateCommKey() {
		let self = this;
		try {
            self.keyCount = self.keyCount? self.keyCount+1: 0;
            self.data._commKey = Date.parse(new Date()).toString() + Date.parse(new Date()).toString() + Date.parse(new Date()).toString().substring(0, 6);
	    } catch (e) {
            console.log("初始化commKey失败", e);
        }
	}

	generateEncryptedString() {
		let self = this;
        try {
            var params = "jwt=" + self.data.token + "&commKey=" + self.data._commKey;
            var jsencrypt = new JSEncrypt();
            jsencrypt.setPublicKey(self.data.publicKey);
            self.data.encryptedString = jsencrypt.encrypt(params);
        } catch (e) {
            console.log("初始化encryptedString失败", e);
        }
    }

    connect() {
    	let self = this;
    	let primus;
    	try {
            primus = self.primus = Primus.connect(self.data.connectionUrl);
            primus.on('outgoing::url', function (url) {
                // url.query = 'login=' + self.data.encryptedString;
                url.query = 'login=' + self.data._commKey;
            });
            primus.on('open', function () {
                self.online = true;
                console.log("连接成功", self.data.connectionUrl);
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
            });
            primus.on('disconnect', function () {
                self.online = false;
                console.log("连接断开", self.data.connectionUrl);
            });
            primus.on('end', function () {
                self.online = false;
                console.log("连接已关闭", self.data.connectionUrl);
            });
        } catch (e) {
            self.primus = null;
            console.log(e);
        }
    }

    onData(data) {
        //解密
        var decryptstr = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(this.data._commKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        var dataString = decryptstr.toString(CryptoJS.enc.Utf8);
        var parsedData;
        try {
            parsedData = JSON.parse(dataString);
        } catch(e) {
            throw e;
        }
        console.log("%c ↓ "+parsedData.cmd, "color:"+"green", parsedData["rep"]||parsedData);

        //更新jwt token
        if (parsedData.cmd == this.cmd.CONN_INIT) {
            this.data.jwtToken = parsedData.rep;
        } else {
            this.event(parsedData.cmd, parsedData.rep);
        }

        switch( parsedData.cmd ){
            case 'conn::error':
                if (parsedData.res && parsedData.res.code == 1003) {
                    this.disconnect();
                    // '异地登录, 请刷新页面'
                }
                break;
            case 'error':
                if( parsedData.rep && parsedData.rep.cmd ) {
                    this.event(parsedData.rep.cmd + '_error', parsedData.rep);
                }
                break;
        }
    }

    send(data) {
    	data = data || {};
    	data.params = data.params || {}; 
    	data.params.token = this.data.jwtToken;
    	var encryptData = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(this.data._commKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        this.primus.write(encryptData.toString());
    }

}