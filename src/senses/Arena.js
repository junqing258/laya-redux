
import BaseSense from "../utils/BaseSense";
import Lapa from "../components/Lapa"

export default class Arena extends Laya.Sprite {
	
	constructor() {
		super();
		this.init();
	}

	getAsset() {
		return [{url: "res/atlas/lapa.json", type: "atlas"}];
	}

	willMount() {
		return new Promise(resolve=> {
			setTimeout(resolve, 1000);
		});
	}
	
	init() {
		let stage = Laya.stage;
		this.size(stage.width, stage.height);
		var lapa = new Lapa();
		lapa.pos(200, 100);
		this.addChild(lapa);
	}
}