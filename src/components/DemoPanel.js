
import connect from 'utils/connect';
import { instance } from "utils/decorators";

var { Stage, Sprite, Event, Handler, Text } = Laya;

export default class DemoPanel extends Laya.Sprite {

	constructor (...args) {
	    super(...args);
		this.width  = Laya.stage.width;
		this.height = Laya.stage.height;
		this._render();
	}

	static getInstance() {
		if (!this.instance||this.instance.destroyed) this.instance = new this();
		return this.instance;
	}

	set state (value) {
		this._state = value;
		// console.log( Object.assign( {}, this._state) );
	}
	
	_render() {
		var txt1 = new Text();
		txt1.set({ color: "#FAF86A", fontSize: 36, pos: [40,40] });
		this.addChild(txt1);
		connect("counter.i", txt1, state => txt1.text = JSON.stringify(state) );

		var txt2 = new Text();
		txt2.set({ color: "#FFFFFF", fontSize: 36, pos: [40,140] });
		this.addChild(txt2);
		connect("todos", txt2, state => txt2.text = JSON.stringify(state) );
	}

}


/*function getStockPrice() {
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
});*/