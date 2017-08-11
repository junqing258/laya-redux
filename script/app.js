
import './utils/laya.jsx.js';
import Connect from './utils/Connect';
import store from './store/store';
import DemoPanel from './components/DemoPanel';
import Lapa from './components/Lapa';
import { todo, increment } from './actions/action';


import Demo from './components/Demo.jsx';

var { Stage, Sprite, Event, Handler, Text } = Laya;

var stage;
Laya.init(1334, 750, Laya.WebGL);
stage = Laya.stage;
stage.scaleMode = Stage.SCALE_FIXED_WIDTH;
stage.alignH = Stage.ALIGN_CENTER;
stage.alignV = Stage.ALIGN_MIDDLE;
stage.screenMode = Stage.SCREEN_HORIZONTAL;
Laya.Stat.show();

Connect.provider(store);

var panel = new DemoPanel();
stage.addChild(panel);


/**
 * test code
 */

store.dispatch( increment({i: 12}) );
store.dispatch( todo({cc: 12}) );
setTimeout( () => store.dispatch( todo({ff: 12}) ), 2000);

Laya.loader.load([{url: "res/atlas/lapa.json", type: "atlas"}], Handler.create(null, () => {
	var lapa = new Lapa();
	lapa.pos(200, 100);
	stage.addChild(lapa);
}));
