import { Connect } from './utils/Connect';
import store from './store/store';
import DemoPanel from './components/DemoPanel';
import { todo, increment } from './actions';

var { Stage, Sprite, Event, Handler, Text } = Laya;

var stage;
Laya.init(1334, 750, Laya.WebGL);
stage = Laya.stage;
stage.scaleMode = Stage.SCALE_FIXED_WIDTH;
stage.alignH = Stage.ALIGN_CENTER;
stage.alignV = Stage.ALIGN_MIDDLE;
stage.screenMode = Stage.SCREEN_HORIZONTAL;

Connect.use(store);

var panel = new DemoPanel();
stage.addChild(panel);

store.dispatch(increment( {i: 12}) );

store.dispatch(todo( {cc: 12}) );
store.dispatch(todo( {dd: 12}) );

setTimeout(() => {
	store.dispatch( todo({ff: 12}) );
}, 2000);

setTimeout(() => {
	store.dispatch( increment({i: 8}) );
}, 3000);
