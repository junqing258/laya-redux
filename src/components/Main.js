


function Main() {
	const { Stage, Sprite, Event, Handler, Browser, Tween, Dialog, Ease } = Laya;
    let stage;
    Laya.init(1334, 750, Laya.WebGL);
    stage = Laya.stage;
    stage.scaleMode = Stage.SCALE_SHOWALL;
    stage.alignH = Stage.ALIGN_CENTER;
    stage.alignV = Stage.ALIGN_MIDDLE;
    stage.screenMode = Stage.SCREEN_HORIZONTAL;
    stage.bgColor = "#210D4D";
    Laya.URL.basePath = window.BASE_PATH || '';
}

Main();


