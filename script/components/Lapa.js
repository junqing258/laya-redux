var { Stage, Sprite, Event, Handler, Text, Tween, Ease, TimeLine } = Laya;

class LapaLine extends Laya.Sprite {

	_lineList = [];
	_tempList1 = [];
	_tempList2 = [];
	
	constructor (...args) {
	    super(...args);
		this._render();

		Laya.timer.once(4000, this, () => {
			this.go();
		});
	}
	
	_render() {
		this.cont0 = new Sprite();
		this.cont1 = new Sprite();
		this.cont1.y = 70*3;
		this.addChildren(this.cont0, this.cont1);
		for (let i=0; i<3; i++) {
			this._lineList.push(1);
			var icon = new Sprite();
			icon.loadImage("lapa/1.png");
			icon.y = i * 70;
			this.cont0.addChild(icon);

			var icon2 = new Sprite();
			icon2.loadImage("lapa/1.png");
			icon2.y = i * 70;
			this.cont1.addChild(icon2);
		}
	}

	go() {
		this._startAni();
	}

	_startAni() {
		Tween.to(this, {y: -70*3}, 250, Ease.bounceIn, Handler.create(this, this._loopAni));
		this._head = 1;
	}

	_loopAni() {
		switch (this._head) {
			case 1:
				this.cont0.y = 70*6;
				this._head = 2;
				Tween.to(this, {y: -70*6}, 200, null, Handler.create(this, this._loopAni));
				break;
			case 2:
				this.cont0.y = 0;
				this.y = 0;
				Tween.to(this, {y: -70*3}, 200, null, Handler.create(this, this._loopAni));
				this._head = 1;
				break;
		}
		
	}

	_stopAni() {

	}

}

export default class Lapa extends Laya.Sprite {

	constructor (...args) {
	    super(...args);
		this._init();
		this.pos(500, 100);
		this.scrollRect = new Laya.Rectangle(0, 0, 70*6, 70*3);
	}

	_init() {
		for (let i=0; i<6; i++) {
			var line = new LapaLine();
			line.x = i * 70;
			this.addChild(line);
		}
	}
}