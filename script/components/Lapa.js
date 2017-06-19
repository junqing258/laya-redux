
import { random } from './../utils/util';

var { Stage, Sprite, Event, Handler, Text, Tween, Ease, TimeLine } = Laya;

const B_WIDTH = 128;
const B_HEIGHT = 128;

class LapaLine extends Laya.Sprite {

	_lineList = [];
	_tempList1 = [];
	_tempList2 = [];

	_stop = false;
	
	constructor (index) {
	    super();
	    this.index = index;

		this._render();

		Laya.timer.once(2000, this, () => {
			this.go();
		});
	}
	
	_render() {
		this.cont0 = new Sprite();
		this.cont1 = new Sprite();
		this.cont1.y = B_HEIGHT * 3;
		this.addChildren(this.cont0, this.cont1);
		for (let i=0; i<3; i++) {
			this._lineList.push(1);
			var icon = new Sprite();
			icon.scale(120/256, 120/256);
			icon.loadImage("lapa/g"+ random(20, 1) +".png");
			icon.y = i * B_HEIGHT;
			this.cont0.addChild(icon);

			var icon2 = new Sprite();
			icon2.scale(120/256, 120/256);
			icon2.loadImage("lapa/g"+ random(20, 1) +".png");
			icon2.y = i * B_HEIGHT;
			this.cont1.addChild(icon2);
		}
	}

	go() {
		this._aniStart();
		setTimeout( () => this.result = 4, 5000 );
	}

	_aniStart() {
		Tween.to(this, {y: -B_HEIGHT*3}, 660, Ease.sineIn, Handler.create(this, this._aniLoop, [1]) );
	}

	_aniLoop(flag) {
		switch (flag) {
			case 1:
				this.cont0.y = B_HEIGHT*6;
				Tween.to(this, {y: -B_HEIGHT*6}, 390, null, Handler.create(this, this._aniLoop, [2]) );
				break;
			case 2:
				this.cont0.y = 0;
				this.y = 0;
				if (this.result) {  return this._aniStop(); }
				Tween.to(this, {y: -B_HEIGHT*3}, 390, null, Handler.create(this, this._aniLoop, [1]) );
				break;
		}
		
	}

	_aniStop() {
		if (this.index < 3) {
			Tween.to(this, {y: -B_HEIGHT*this.index }, this.index*390/3, null, Handler.create(this, () => {
				Tween.to(this, {y: -B_HEIGHT*(this.index+1)}, 600, Ease.elasticOut);
			}) );
		} else {
			Tween.to(this, {y: -B_HEIGHT*3}, 390, null, Handler.create(this, () => {
				this.cont0.y = B_HEIGHT*6;
				Tween.to(this, {y: -B_HEIGHT*this.index }, (this.index)*390/3-390, null, Handler.create(this, () => {
					Tween.to(this, {y: -B_HEIGHT*(this.index+1) }, 600, Ease.elasticOut);// elasticOut bounceOut
				}) );
			}) );
		}
	}

}

export default class Lapa extends Laya.Sprite {

	constructor () {
	    super();
		this._init();
		this.pos(500, 100);
		this.scrollRect = new Laya.Rectangle(0, 0, B_WIDTH*6, B_HEIGHT*3); // viewport
	}

	_init() {
		for (let i=0; i< 6; i++) {
			var line = new LapaLine(i);
			line.x = i * B_WIDTH;
			this.addChild(line);
		}
	}
}