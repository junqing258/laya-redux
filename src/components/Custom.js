
import Sound, { AD_BTN } from "../component/Sound";

const { Stage, Sprite, Image, Event, Handler, Text, Tween, Ease } = Laya;

export class DButton extends Laya.Sprite {
	
	constructor(skin, props) {
		super();
		props = props || {};
        this._skin = skin;
		let _itexture = Laya.loader.getRes(skin);
        let sw = _itexture.sourceWidth,
            sh = _itexture.sourceHeight;
        this.size(sw, sh);
        this.pivot(sw/2, sh/2);
        if (props.x) this.x = props.x + sw/2;
        if (props.y) this.y = props.y + sw/2;
		this.delay = props.delay || 300;
		this._opskin = props.opskin;
		this.aduio = props.aduio || AD_BTN;
		this.drawSkin(this._skin);
		this._init();
		return this;
	}

	_init() {
		this.cleared = false;
		this.on(Event.MOUSE_DOWN, this, this.handleTouchIn);
		this.on(Event.MOUSE_UP, this, this.handleTouchOver);
		
		let _isFirbid = false;
		if (this._opskin) {
			Laya.getset(0, this, "isForbid", ()=> _isFirbid, val=> {
				_isFirbid = val;
				let url = !val? this._skin: this._opskin;
				this.drawSkin(url);
			});
		}
	}

	drawSkin(url) {
        url = url || this._skin;
		if (!this.cleared) this.cleanSkin();
		let texture = Laya.loader.getRes(url);
		this.graphics.drawTexture(texture);
		this.cleared = false;
		return this;
	}

	cleanSkin() {
		this.cleared = true;
		this.graphics.clear();
		return this;
	}


	handleTouchIn() {
		if (this.isForbid||this.__clicked) { return false; }
        this.__clicked = true;
        this.scale(0.95, 0.95);
		if (this.aduio) Sound.play(this.aduio);
        this.cktimer = setTimeout(() => {
            this.scale(1, 1);
            this.__clicked = false;
        }, 300);
	}

	handleTouchOver() {
		if (this.isForbid) { return false; }
		clearTimeout(this.cktimer);
        this.scale(1, 1);
        if (this.__clicked) {
        	typeof this.handleClick === "function" && this.handleClick();
        	setTimeout(() => this.__clicked = false, this.delay);
        }
	}

	on(type, caller, listener, args) {
		if (type === Event.CLICK) {
			this.handleClick = listener.bind(caller, args);
		} else {
			return super.on(type, caller, listener, args);
		}
	}
	
}


export function DButtonDecorator(button, props) {
	if (!button instanceof Sprite) { console.warn("cannot decorator button"); }
	let _this = button;
	props = props || {};
    
    _this.pivot(_this.width/2, _this.height/2);
    _this.x += _this.width/2;
	_this.y += _this.height/2;
	_this.aduio = props.aduio || AD_BTN;
	_this.delay = props.delay || 300;
	_this.on(Event.MOUSE_DOWN, _this, () => DButton.prototype.handleTouchIn.call(_this));
    _this.on(Event.MOUSE_UP, _this,  () => DButton.prototype.handleTouchOver.call(_this));
	_this.on = function() {	 DButton.prototype.on.apply(_this, arguments); };
	let _isFirbid = false;
	if (props.opskin) {
		_this.__skin = _this.skin;
		_this.__opskin = props.opskin;
		Laya.getset(0, _this, "isForbid", ()=> _isFirbid, val=> {
			_isFirbid = val;
			_this.skin = !val? _this.__skin: _this.__opskin;
		});
	}
    return _this;
}


export  class RepoterPoup extends Laya.Sprite {
	// static instance;

	constructor() {
		super();
		this.__init();
	}

	static getInstance() {
		return this.prototype.constructor.instance || new this();
	}

	__init() {
		
	}

	show(props) {
		props = props || {};
		this.set( { x: 1334-this.width, y: (Laya.stage.height-this.height)/2+(props.offsetY||0), scaleX: 1 } );
		Tween.from(this, { x: 1334+this.width/2 , scaleX: 0.1 }, 160, Ease.backOut );
		Laya.stage.addChild(this);
	}

	close() {
		Tween.to(this, { x: 1334+this.width/2 , scaleX: 0.1 }, 160, null, Handler.create(null, ()=> {
			this.removeSelf();
			this.event("close");
		}) );
	}

}

