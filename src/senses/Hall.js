
import BaseSense from "../utils/BaseSense";
import DemoPanel from "../components/DemoPanel"

export default class Hall extends Laya.Sprite {
	
	constructor() {
		super();
		this.init();
	}

	getAsset() {
		return [];
	}
	
	init() {
		let stage = Laya.stage;
		this.size(stage.width, stage.height);
		var panel = DemoPanel.getInstance();
		this.addChild(panel);
	}
}