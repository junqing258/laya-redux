
import Connect from 'utils/Connect';

var { Stage, Sprite, Event, Handler, Text } = Laya;



function annotation(target) {
   target.annotated = true;
}

@annotation
export default class DemoPanel extends Laya.Sprite {

	constructor (...args) {
	    super(...args);
		this.width  = Laya.stage.width;
		this.height = Laya.stage.height;
		this._render();
		Connect("counter", this);
	}

	set state (value) {
		this._state = value;
		// console.log( Object.assign( {}, this._state) );
	}
	
	_render() {
		var txt1 = new Text();
		txt1.set({ color: "#FAF86A", fontSize: 36, pos: [40,40] });
		this.addChild(txt1);
		Connect("counter.i", txt1, state => txt1.text = JSON.stringify(state) );

		var txt2 = new Text();
		txt2.set({ color: "#FFFFFF", fontSize: 36, pos: [40,140] });
		this.addChild(txt2);
		Connect("todos", txt2, state => txt2.text = JSON.stringify(state) );
	}

}