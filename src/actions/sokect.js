import { env } from 'utils/util';
import ShimoNet from 'utils/ShimoNet';
import Tips from "popup/Tips";
import Confirm from "popup/Confirm";

export let socket = new ShimoNet({
	'connectionUrl': window.websocketurl,
	'token': window.token,
	'publicKey': window.publicKey
});
socket.connect();

export let socketDisptcher = socket.disptcher = new Laya.EventDispatcher();

socket.send = function(cmd, params) {
	if (!socket.online) return;
	ShimoNet.prototype.send.apply(socket, arguments);
};

export let send = function() {
	socket.send.apply(socket, arguments);
};

socket.onData = (cmd, res) => {
	switch (cmd) {
		case "conn::error":
			if (res && res.code == "1003") {
				socket.primus.end();
				Confirm.getInstance().popup("您已在其它地点登录", {
					align: "center",
					close: ()=> location.reload()
				});
			}
			break;
		case "error":
			Log.error(cmd, res);
			break;
		default:
			socketDisptcher.event(cmd, [res]);
			break;
	}
};

socketDisptcher.onlive = function(cmd, component, cb) {
	if (!component || component.destroyed || typeof cb !== 'function') return console.warn('socket cmd not listening');
	let _listenCb = function(...args) {
		if (!component || component.destroyed) {
			socketDisptcher.off(cmd, component, _listenCb);
		} else if (_listenCb.displayedInStage !== false) {
			cb(...args);
		}
	};
	socketDisptcher.on(cmd, component, _listenCb);
};

if (env !== 'product') window.DEVIO = socket;