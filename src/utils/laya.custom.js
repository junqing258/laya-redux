(function() {

Laya.LocalStorage.__init__();

Laya.Node.prototype.set = function(param) {
	var self = this;
	Object.keys(param).forEach(function(key, i) {
		switch (key) {
			case 'pos':
				self.pos(param[key][0], param[key][1]);
				break;
			default:
				self[key] = param[key];
				break;
		}
	});
	return self;
};

/* Laya.Node.prototype.destroy=function(destroyChild){
	(destroyChild===void 0)&& (destroyChild=true);
	this.destroyed=true;
	this._parent && this._parent.removeChild(this);
	if (this._childs){
		if (destroyChild)this.destroyChildren();
		else this.removeChildren();
	}
	this._childs=null;
	this._$P=null;
	this.offAll();
	if (this.timer&&this.timer.clearAll) this.timer.clearAll(this);
}; */

Laya.Sprite.prototype.resizable = function(cb) {
	var self = this, stage = Laya.stage;
	if (!stage || typeof cb !== "function") return;
	cb();
	var _resizeCb = function() {
		if (self.resizeTimer) return;
		self.resizeTimer = true;
		setTimeout(function() {
			self.resizeTimer = false;
		}, 300);
		if (!self||self.destroyed) { 	
			stage.off("resize", null, _resizeCb);
		} else if (self.displayedInStage!==false) {
			cb();
		}
	};
	stage.on("resize", null, _resizeCb);
};

/**
 * Dialoag
 */
(function() {
	var __proto = Laya.Dialog.prototype;
	__proto.show=function(closeOther){
		(closeOther===void 0)&& (closeOther=false);
		this._open((this.isModal!==false), closeOther);
	};
})();
/**
 * DialogManager
 */
(function() {
	var __proto = Laya.DialogManager.prototype;

	__proto.close=function(dialog,type){
		if (dialog.closeEffect !=null)dialog.closeEffect.runWith([dialog,type]);
		else this.doClose(dialog,type);
		dialog.event("close");
		this.event("close");
	};
	
	__proto.open=function(dialog,closeOther){
		(closeOther===void 0)&& (closeOther=false);
		if (closeOther)this._closeAll();
		if (dialog.popupCenter)this._centerDialog(dialog);
		this.addChild(dialog);
		if (dialog.isModal || this._$P["hasZorder"])this.timer.callLater(this,this._checkMask);
		if (dialog.popupEffect !=null)dialog.popupEffect.runWith(dialog);
		else this.doOpen(dialog);
		dialog.event(/*laya.events.Event.OPEN*/"open");
		this.event(/*laya.events.Event.OPEN*/"open");
	};

	__proto._checkMask=function(){
		this.maskLayer.removeSelf();
		for (var i=this.numChildren-1;i >-1;i--){
			var dialog=this.getChildAt(i);
			if (dialog && dialog.isModal){
				this.addChildAt(this.maskLayer,i);
				return;
			}
		}
	};

})();


Laya.BoneSlot.prototype.replaceDisplayByIndex=function(tarIndex,newIndex){
	if (!this.currSlotData)return;
	this._replaceDic[tarIndex]=newIndex;
	if (this.displayIndex==tarIndex){
		this.showDisplayByIndex(newIndex);
	}
};

Laya.URL.customFormat = function (url) {
	let vr = window.IMG_VERSION || "20171011";
    if (!Laya.Render.isConchApp && url.indexOf("?v=")< 0 && url.indexOf("data:image")< 0){
        url += ("?v=" + vr);
    }
    return url;
};


})();
