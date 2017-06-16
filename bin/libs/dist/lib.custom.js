
(function() {

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
	}

})();