
import { random } from './../utils/util';

var { Stage, Sprite, Image, Event, Handler, Text, Tween, Ease, TimeLine } = Laya;

const B_WIDTH = 128;
const B_HEIGHT = 128;

const LA_ROWS = 3;
const LA_COLUMNS = 6;

class LapaLine extends Laya.Sprite {

	_lineList = [];
	_tempList1 = [];
	_tempList2 = [];

	_stop = false;
	
	constructor (rowNum) {
	    super();
	    this.rowNum = rowNum;
		this._render();

		Laya.timer.once(1000, this, this.go);
	}
	
	_render() {
		this.cont0 = new Sprite();
		this.cont1 = new Sprite();
		this.cont1.y = B_HEIGHT * 3;
		this.addChildren(this.cont0, this.cont1);
		for (let i=0; i<3; i++) {
			this._lineList.push(1);
			var icon = new Image();
			icon.scale(120/256, 120/256);
			icon.skin = ("lapa/g"+ random(18, 1) +".png");
			icon.y = i * B_HEIGHT;
			this.cont0.addChild(icon);

			var icon2 = new Image();
			icon2.scale(120/256, 120/256);
			icon2.skin = ("lapa/g"+ random(18, 1) +".png");
			icon2.y = i * B_HEIGHT;
			this.cont1.addChild(icon2);
		}
	}

	reset() {
		for (let i=0; i<LA_ROWS; i++) {
			this.cont0.getChildAt(i).skin = "lapa/g"+ random(18, 1) +".png";
			this.cont1.getChildAt(i).skin = "lapa/g"+ random(18, 1) +".png";
		}
	}

	go() {
		this._aniStart();
		setTimeout( () => this.result = 4, 2000 );
	}

	_aniStart() {
		Tween.to(this, {y: -B_HEIGHT*LA_ROWS}, 660, Ease.sineIn, Handler.create(this, this._aniLoop, [1]));
	}

	_aniLoop(flag) {
		switch (flag) {
			case 1:
				this.cont0.y = B_HEIGHT*LA_ROWS*2;
				Tween.to(this, {y: -B_HEIGHT*LA_ROWS*2}, 330, null, Handler.create(this, this._aniLoop, [2]) );
				break;
			case 2:
				this.cont0.y = 0;
				this.y = 0;
				if (this.result) { return this._aniStop(); }
				Tween.to(this, {y: -B_HEIGHT*LA_ROWS}, 330, null, Handler.create(this, this._aniLoop, [1]) );
				break;
		}
		
	}

	_aniStop() {
		var lCount = (this.lCount||this.lCount===0)? this.lCount: this.rowNum;
		if (lCount === 0) {
			for (let i=0; i<LA_ROWS; i++) {
				this.cont1.getChildAt(i).skin = "lapa/g"+ 20 +".png";
			}
			Tween.to(this, {y: -B_HEIGHT*2.5 }, 2.5*110, null, Handler.create(this, () => {
				Tween.to(this, {y: -B_HEIGHT*LA_ROWS }, 900, Ease.elasticOut);
			}) );
			this.lCount = null;
		} else if (lCount >= 1 && lCount<= LA_ROWS) {
			let tc = 0;
			for (let i=lCount; i<=LA_ROWS; i++) {
				if (i<= LA_ROWS) {
					tc = i;
					this.cont1.getChildAt(i-1).skin = "lapa/g"+ 20 +".png";
				}
			}
			Tween.to(this, {y: -B_HEIGHT*LA_ROWS }, 330, null, Handler.create(this, () => {
				this.cont0.y = B_HEIGHT*LA_ROWS*2;
				let s = LA_ROWS-tc;
				for (; s<LA_ROWS; s++) {
					this.cont0.getChildAt(s).skin = "lapa/g"+ 20 +".png";
				}
				Tween.to(this, {y: -B_HEIGHT*(lCount+2.5) }, (lCount+2.5)*330/LA_ROWS-330, null, Handler.create(this, () => {
					Tween.to(this, {y: -B_HEIGHT*(lCount+LA_ROWS) }, 900, Ease.elasticOut);
				}) );
			}) );
			this.lCount = null;
		} else {
			this.lCount = lCount-LA_ROWS;
			Tween.to(this, {y: -B_HEIGHT*LA_ROWS}, 330, null, Handler.create(this, () => {
				this.cont0.y = B_HEIGHT*6;
				Tween.to(this, {y: -B_HEIGHT*LA_ROWS*2}, 330, null, Handler.create(this, () => {
					this.cont0.y = 0;
					this.y = 0;
					this._aniStop();
				}) );
			}) );
		}
		if (!this.reset) {
			this.reset = true;
			setTimeout(this.reset.bind(this), 2000);
		}
		
	}

}

export default class Lapa extends Laya.Sprite {

	constructor () {
	    super();
		this._init();
		this.scrollRect = new Laya.Rectangle(0, 0, B_WIDTH*6, B_HEIGHT*LA_ROWS); // viewport
	}

	_init() {
		for (let i=0; i< 6; i++) {
			var line = new LapaLine(i);
			line.x = i * B_WIDTH;
			this.addChild(line);
		}
	}
}