
let tpl = [
    "<span style='color:#dff8ff'>恭喜</span>",
    "<span style='color:#98ff66'>$0</span>",
    "<span style='color:#dff8ff'>，在</span>",
    "<span style='color:#6eb1fd'>$1</span>",
    "<span style='color:#dff8ff'>号机台获得</span>",
    "<span style='color:#ffd632'>$2</span>",
    "<span style='color:#dff8ff'>积分奖励！</span>"
].join("");

const DEFAULT_CONFIG = {
    "width"     : 600,
    "fontSize"  : 30,
    "color"     : "#ffffff", //默认颜色值
    "repeat"    : true, //是否允许重复的公告
    "type"      : "single", //single : 单条   multiple : 多条连续
    "margin"    : 50,
    "tpl"       : tpl, //公告模板，例如 上面的模板示例
    "speed"     : 100, //每隔1ms移动的像素
    "delay"     : 200, //每条公告间隔的时间
    /* "complete"  : function () {
        console.log("公告列表为空，已执行回调函数.");
    } */
};

let notifyList = [], recycleList = [];

export default class Marquee extends Laya.Sprite {
	constructor(config) {
		super();
		this.config = null;
		this.marqueePanel = null;
		this.isAnimation = false;
		this.init(config);
	}

	init(config) {
		config = Object.assign({}, DEFAULT_CONFIG, config);
		this.config = config;
		this.size(config.width, config.fontSize);
		this.scrollRect = {x : 0, y : 0, width : this.width, height : this.height + 5};
		this.marqueePanel = new MarqueePanel(config.fontSize, config.margin);
		this.addChild(this.marqueePanel);
		MarqueeItem.style = {
			font: config.font,
			fontSize: config.fontSize,
			color: "#ffffff",
		};
	}

	setHtml(data) {
		var html = this.config.tpl;
		var tmp = new RegExp("恭喜(.*)，在(.*)号机台获得(.*)积分奖励.*");
		if (tmp.test(data)) {
			let ts = data.match(tmp);
			data = ts.slice(1, ts.length);
		}
		html = html.replace(/\$(\d)/g, function(v, cont) {
			return data[cont];
		});
		return html;
	}
	
	addData(data) {
		let html = "";
		if (this.config.tpl) {
			html = this.setHtml(data);
		} else {
			html = data;
		}
		notifyList.push(html);
	}

	createItem() {
		let limit = 0;
		switch(this.config.type) {
			case "single":
				if (this.marqueePanel.numChildren !== 0) { return; }
				limit = 1;
				break;
			case "multiple":
				if (this.marqueePanel.numChildren >= 10) { return; }
				limit = 10;
				break;
		}
		
		while(notifyList.length && limit) {
			let htmlData = notifyList.shift();/* || recycleList.shift();
			recycleList.push(htmlData);
			if (recycleList.length>100) recycleList.shift();*/
			this.marqueePanel.addItem(MarqueeItem.create(htmlData));
			limit--;
		}
	}

	next() {
		if (this.marqueePanel.numChildren === 0 && notifyList.length === 0) {
			this.config.complete && typeof this.config.complete === "function" && this.config.complete();
			return;
		}
		if (this.isAnimation||this.isPaused) {
			return;
		}
		this.isAnimation = true;

		this.createItem();

		var itemWidth = this.marqueePanel.getChildAt(0).width;
		var totalTime = itemWidth / this.config.speed * 1000;

		if (this.config.type === "single") {
			this.marqueePanel.x = this.width;
			totalTime += this.width / this.config.speed * 1000;
		}

		Laya.Tween.to(this.marqueePanel, {
			x: -itemWidth - this.config.margin
		}, totalTime, null, Laya.Handler.create(this, function() {
			this.marqueePanel.removeItem();
			this.isAnimation = false;
			this.next();
		}), this.config.delay);
	}

	pause() {
		this.isPaused = true;
	}

	start() {
		this.isPaused = false;
		this.next();
	}
	
	add(data) {
		if (Array.isArray(data)) {
			data.forEach(i=> this.addData(data[i]));
			this.createItem();
			this.next();
		} else {
			this.addData(data);
			this.createItem();
			this.start();
		}
	}

}

class MarqueePanel extends Laya.Box {
	constructor(height, margin) {
		super();
		this.height = height;
		this.margin = margin;
	}
	addItem(item) {
		item.x = this.width;
		this.width += (item.width + this.margin);
		this.addChild(item);
	}
	removeItem() {
		let deadedItem = this.getChildAt(0), deadWidth = deadedItem.width+this.margin;
		for(var i = this.numChildren - 1; i >= 1; i --) {
			this.getChildAt(i).x -= deadWidth;
		}
		this.width -= deadWidth;
		this.x = 0;
		deadedItem.destroy();
	}
}

class MarqueeItem extends Laya.Box {
	static Pool = [];

	constructor(data, style) {
		super();
		this.htmlElement = null;
		this.init(data);
	}

	static create(data) {
		let Pool = MarqueeItem.Pool;
		if (Pool.length !== 0) {
			return Pool.pop().reset(data);
		} else {
			return new MarqueeItem(data);
		}
	}

	static clear() {
		let Pool = MarqueeItem.Pool;
		Pool.forEach(i=> Pool[i].destroy(true));
		Pool = [];
	}

	init(html) {
		this.setup();
		this.setText(html);
	}
	
	setText(html) {
		this.htmlElement.innerHTML = html;
		this.size(this.htmlElement.contextWidth, this.htmlElement.contextHeight);
	}

	setup(style) {
		style = style || MarqueeItem.style || {};
		let htmlElement = this.htmlElement = new Laya.HTMLDivElement();
			htmlElement.style.whiteSpace = "nowrap";
		if (typeof style==="object") Object.keys(style).forEach(key=> htmlElement.style[key] = style[key]);
		this.addChild(htmlElement);
	}
}