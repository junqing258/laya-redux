
import connect, { provider } from 'utils/connect';
import store from 'store/store';
import sokect from 'actions/sokect';
import { todo, increment } from 'actions/action';

import SenseManager from "utils/SenseManager";

import Hall from "senses/Hall";
import Arena from "senses/Arena";

const { Stage, Sprite, Event, Handler, Text } = Laya;

var stage;
Laya.init(1334, 750, Laya.WebGL);
stage = Laya.stage;
stage.scaleMode = Stage.SCALE_FIXED_WIDTH;
stage.alignH = Stage.ALIGN_CENTER;
stage.alignV = Stage.ALIGN_MIDDLE;
stage.screenMode = Stage.SCREEN_HORIZONTAL;
// Laya.Stat.show();

provider(store);

/**
 * test code
 */

store.dispatch( increment({i: 12}) );
store.dispatch( todo({cc: 12}) );
setTimeout( () => store.dispatch( todo({ff: 12}) ), 2000);

SenseManager.reg([
	{ router: "/hall", component: Hall },
	{ router: "/arena", component: Arena }
]);

SenseManager.loadSense("/hall");
setTimeout(function() {
	SenseManager.loadSense("/arena");
	setTimeout(()=> SenseManager.goBack(), 3000);
}, 3000);



function getStockPrice() {
	return new Promise(resolve=> {
		setTimeout(()=> resolve(66666), 1000)
	});
}

async function getStockPriceByName(name) {
  let stockPrice = await getStockPrice(12);
  return stockPrice;
}

getStockPriceByName('goog').then(function (result) {
  console.log(result);
});


