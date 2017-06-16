import { Connect } from './../utils/Connect';

var { Stage, Sprite, Event, Handler, Text } = Laya;

export default class DemoPanel extends Laya.Sprite {

	constructor (...args) {
	    super(...args);
		this.width  = Laya.stage.width;
		this.height = Laya.stage.height;
		this._render();
	}
	
	_render() {
		var txt1 = new Text();
		txt1.color = '#FFFFFF';
		txt1.fontSize = 32;
		txt1.pos(40, 40);
		this.addChild(txt1);
		Connect("counter.i", txt1, function(state) {
			txt1.text = JSON.stringify(state)
		});


		var txt2 = new Text();
		txt2.color = '#FFFFFF';
		txt2.fontSize = 32;
		txt2.pos(40, 140);
		this.addChild(txt2);
		Connect("todos", txt2, function(state) {
			txt2.text = JSON.stringify(state)
		});

	}


}