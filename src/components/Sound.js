
import Connect from './../utils/Connect';
import { getIn } from './../utils/util';
import store from './../store/store';

const { Handler, Event } = Laya;

export const AD_BG          = "audio/bg.mp3";
export const AD_BTN         = "audio/btn.mp3";
export const AD_DROP        = "audio/drop.mp3";
export const AD_LINE1       = "audio/line1.mp3";
export const AD_LINE5       = "audio/line5.mp3";
export const AD_LINE5X      = "audio/line5x.mp3";
export const AD_STARTX1     = "audio/startx1.mp3";
export const AD_STARTX2     = "audio/startx2.mp3";
export const AD_WIN     	= "audio/win.mp3";
export const AD_WIN_BIG     = "audio/win_big.mp3";
export const AD_WIN_SUPPER  = "audio/win_supper.mp3";
export const AD_Z_PIAOLIANG = "audio/z_piaoliang.mp3";
export const AD_Z_WANMEI    = "audio/z_wanmei.mp3";
export const AD_Z_ZHENGBANG = "audio/z_zhengbang.mp3";
export const AD_COINFLY = "audio/coinFly.mp3";

const BG = [ AD_BG ]; // 背景
const LOW_BG = [ ]; //需要降低背景乐

export default class Sound extends Laya.SoundManager {

	static initial() {
		// this.setSoundVolume(0.3, SD_JACPOT_PRIZE);
		// this.setMusicVolume(0.6);
		
		Connect("gameStatus.voiceOn", this, state => {
			this.voiceOn = state;
			if (this.voiceOn) {
				this.play(AD_BG);
			} else {
				this.stopAll();
			}
		});
	}
	
	static play(url, loop) {
		if (!this.voiceOn) return;
		if (BG.indexOf(url)>-1) {
			this.playMusic(url, 0);
		} else if (LOW_BG.indexOf(url)>-1) {
			this.setMusicVolume(0.1);
			this.playSound(url, loop||1, Handler.create(this, ()=> { this.setMusicVolume(0.6); }));
		} else {
			this.playSound(url, loop||1);
		}
	}

	static stop(url) {
		if (BG.indexOf(url)>-1) {
			this.stopMusic();
		} else if (LOW_BG.indexOf(url)>-1) {
			this.setMusicVolume(0.6);
			this.stopSound(url);
		} else {
			this.stopSound(url);
		}
	}


}