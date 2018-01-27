/*import connect, { provider } from 'utils/connect';
import store from 'store/store';
import sokect from 'actions/sokect';
import { todo, increment } from 'actions/action';

import SenseManager from "utils/SenseManager";*/

import Play from "components/Play";

const { Stage, Sprite, Event, Handler, Text } = Laya;

export default function App() {

    var stage;
    Laya.init(1334, 750, Laya.WebGL);
    Laya.MiniAdpter.init();
    stage = Laya.stage;
    stage.scaleMode = Stage.SCALE_FIXED_WIDTH;
    stage.alignH = Stage.ALIGN_CENTER;
    stage.alignV = Stage.ALIGN_MIDDLE;
    stage.screenMode = Stage.SCREEN_HORIZONTAL;
    stage.bgColor = "#46ABFC";
    // Laya.URL.basePath = "http://h1.jkimg.net/gameapp_24caipiao/game/byxxl";

    const registeFnt = fontRes => {
        for (let i = 0; i < fontRes.length; i++) {
            let bitmapFont = new Laya.BitmapFont();
            bitmapFont.loadFont(fontRes[i].url);
            Laya.Text.registerBitmapFont(fontRes[i].name, bitmapFont);
        }
    }


    Laya.loader.load([
        { url: "res/atlas/fish.json", type: "atlas" },
        { url: "res/bg_cells.png", type: "image" },
        { url: "res/bg.jpg", type: "image" },
        { url: "res/prizeFont.fnt", type: "xml" },
        { url: "res/prizeFont.png", type: "image" },
	], Laya.Handler.create(null, () => {
        registeFnt([
            { url: "res/prizeFont.fnt", name: "prizeFont", type: "xml" },
		]);
        let bg = new Laya.Image("res/bg.jpg");
        let play = new Play();
        play.pos(200, 35);
        Laya.stage.addChildren(bg, play);
    }));


}