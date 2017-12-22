
import connect, { getIn } from 'utils/connect';
import store from "store/store";
import SenseManager from "utils/SenseManager";
// import { Pubsub } from "constants/const";

const { Handler, Event } = Laya;
const list = [
"bet.mp3",      "btn.mp3",          "play.mp3",            "poker_stop.mp3",  "supper_end.mp3",
"bg.mp3",       "end_stettle.mp3",  "poker_hold.mp3",      "prize_drop.mp3",  "supper_start.mp3",
"bg_hall.mp3",  "intable.mp3",      "poker_rotating.mp3",  "supper.mp3",      "supper_win.mp3" ];

const BG = [ "bg.mp3", "bg_hall.mp3" ]; // 背景
const LOW_BG = [ ]; //需要降低背景乐
let voiceOn, musicOn;

export default class Sound extends Laya.SoundManager {

	static initial() {
		// this.setSoundVolume(0.3, SD_JACPOT_PRIZE);
		this.setMusicVolume(0.6);
		
		connect("hall.sound", this, state => {
			({ voiceOn, musicOn } = state);
			if (!voiceOn) this.stopAllSound();
			if (!musicOn) {
				this.stopMusic();
			} else {
				let curRouter = SenseManager.getCurRouter();
				switch (curRouter) {
					case "/arena":
						this.play("bg.mp3");
						break;
					case "/hall":
					case "/entra":
						this.play("bg_hall.mp3");
						break;
				}
			}
		});
	}
	
	static play(name, loop) {
		let url = `audio/${name}`;
		if (BG.indexOf(name)>-1) {
			if (musicOn) this.playMusic(url, 0);
		} else {
			if (voiceOn) this.playSound(url, loop||1);
		}
	}

	static stop(name) {
		let url = `audio/${name}`;
		if (BG.indexOf(name)>-1) {
			this.stopMusic();
		} else {
			this.stopSound(url);
		}
	}


}