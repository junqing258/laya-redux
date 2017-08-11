/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./bin/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/* no static exports found */
/* all exports used */
/*!*********************************!*\
  !*** ./script/utils/Connect.js ***!
  \*********************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = Connect;

var _util = __webpack_require__(/*! ./util */ 1);

var subList = {};
function Connect(path, component, bindState) {
	if (!component.uuid) {
		component.uuid = (0, _util.uuid)();
	}
	if (!subList[path]) {
		subList[path] = {};
	}
	subList[path][component.uuid] = component;

	bindState && (component.bindState = bindState);

	var _state = (0, _util.getIn)(Connect.store, path);
	component.state = _state;
	if (typeof component.bindState === "function") {
		component.bindState(_state);
	}
}

Connect.provider = function (store) {
	if (Connect.store) {
		console.warn("store be used");
	}
	Connect.store = store;
	var unsubscribe = store.subscribe(function () {
		Object.keys(subList).forEach(function (path) {
			Object.keys(subList[path]).forEach(function (uuid) {
				var component = subList[path][uuid];
				var _state = (0, _util.getIn)(Connect.store, path);
				if ( /*component.displayedInStage===false || */component.destroyed) {
					return delete subList[path][uuid];
				}
				if (component.state !== _state) {
					if (typeof component.bindState === "function") {
						component.bindState(_state, component.state);
					}
					component.state = _state;
				}
			});
		});
	});
};

/***/ }),
/* 1 */
/* no static exports found */
/* all exports used */
/*!******************************!*\
  !*** ./script/utils/util.js ***!
  \******************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.uuid = uuid;
exports.getIn = getIn;
exports.random = random;
function uuid() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
	});
	return uuid;
}

function getIn(store, path) {
	var paths = path.split(".");
	var obj = store.getState();
	paths.forEach(function (param, i) {
		obj = obj[param];
	});
	return obj;
}

function random(max, min) {
	min = min || 0;
	return min + Math.round(Math.random() * (max - min));
}

/***/ }),
/* 2 */
/* no static exports found */
/* all exports used */
/*!***********************!*\
  !*** ./script/app.js ***!
  \***********************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! ./utils/laya.jsx.js */ 11);

var _Connect = __webpack_require__(/*! ./utils/Connect */ 0);

var _Connect2 = _interopRequireDefault(_Connect);

var _store = __webpack_require__(/*! ./store/store */ 10);

var _store2 = _interopRequireDefault(_store);

var _DemoPanel = __webpack_require__(/*! ./components/DemoPanel */ 5);

var _DemoPanel2 = _interopRequireDefault(_DemoPanel);

var _Lapa = __webpack_require__(/*! ./components/Lapa */ 6);

var _Lapa2 = _interopRequireDefault(_Lapa);

var _action = __webpack_require__(/*! ./actions/action */ 3);

var _Demo = __webpack_require__(/*! ./components/Demo.jsx */ 4);

var _Demo2 = _interopRequireDefault(_Demo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _Laya = Laya,
    Stage = _Laya.Stage,
    Sprite = _Laya.Sprite,
    Event = _Laya.Event,
    Handler = _Laya.Handler,
    Text = _Laya.Text;


var stage;
Laya.init(1334, 750, Laya.WebGL);
stage = Laya.stage;
stage.scaleMode = Stage.SCALE_FIXED_WIDTH;
stage.alignH = Stage.ALIGN_CENTER;
stage.alignV = Stage.ALIGN_MIDDLE;
stage.screenMode = Stage.SCREEN_HORIZONTAL;
Laya.Stat.show();

_Connect2.default.provider(_store2.default);

var panel = new _DemoPanel2.default();
stage.addChild(panel);

/**
 * test code
 */

_store2.default.dispatch((0, _action.increment)({ i: 12 }));
_store2.default.dispatch((0, _action.todo)({ cc: 12 }));
setTimeout(function () {
	return _store2.default.dispatch((0, _action.todo)({ ff: 12 }));
}, 2000);

Laya.loader.load([{ url: "res/atlas/lapa.json", type: "atlas" }], Handler.create(null, function () {
	var lapa = new _Lapa2.default();
	lapa.pos(200, 100);
	stage.addChild(lapa);
}));

/***/ }),
/* 3 */
/* no static exports found */
/* all exports used */
/*!**********************************!*\
  !*** ./script/actions/action.js ***!
  \**********************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.todo = todo;
exports.increment = increment;
function todo(item) {
	return function (dispatch, getState) {
		setTimeout(function () {
			return dispatch({
				type: 'TODO',
				payload: item
			});
		}, 2000);
	};
}

function increment(p) {
	return {
		type: 'INCREMENT',
		payload: p
	};
}

/***/ }),
/* 4 */
/* no static exports found */
/* all exports used */
/*!************************************!*\
  !*** ./script/components/Demo.jsx ***!
  \************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Demo = function () {
	function Demo() {
		_classCallCheck(this, Demo);
	}

	_createClass(Demo, [{
		key: "handClick",
		value: function handClick(data) {}
	}, {
		key: "render",
		value: function render() {
			var profile = Laya.createElement(
				Sprite,
				{ onClick: this.handClick.bind(this) },
				Laya.createElement(Image, { src: "avatar.png", x: 20 }),
				Laya.createElement(
					Text,
					null,
					[user.firstName, user.lastName].join(' ')
				)
			);
		}
	}]);

	return Demo;
}();

exports.default = Demo;

/***/ }),
/* 5 */
/* no static exports found */
/* all exports used */
/*!****************************************!*\
  !*** ./script/components/DemoPanel.js ***!
  \****************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Connect = __webpack_require__(/*! ./../utils/Connect */ 0);

var _Connect2 = _interopRequireDefault(_Connect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Laya = Laya,
    Stage = _Laya.Stage,
    Sprite = _Laya.Sprite,
    Event = _Laya.Event,
    Handler = _Laya.Handler,
    Text = _Laya.Text;

var DemoPanel = function (_Laya$Sprite) {
	_inherits(DemoPanel, _Laya$Sprite);

	function DemoPanel() {
		var _ref;

		_classCallCheck(this, DemoPanel);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		var _this = _possibleConstructorReturn(this, (_ref = DemoPanel.__proto__ || Object.getPrototypeOf(DemoPanel)).call.apply(_ref, [this].concat(args)));

		_this.width = Laya.stage.width;
		_this.height = Laya.stage.height;
		_this._render();
		(0, _Connect2.default)("counter", _this);
		return _this;
	}

	_createClass(DemoPanel, [{
		key: "_render",
		value: function _render() {
			var txt1 = new Text();
			txt1.set({ color: "#FAF86A", fontSize: 36, pos: [40, 40] });
			this.addChild(txt1);
			(0, _Connect2.default)("counter.i", txt1, function (state) {
				return txt1.text = JSON.stringify(state);
			});

			var txt2 = new Text();
			txt2.set({ color: "#FFFFFF", fontSize: 36, pos: [40, 140] });
			this.addChild(txt2);
			(0, _Connect2.default)("todos", txt2, function (state) {
				return txt2.text = JSON.stringify(state);
			});
		}
	}, {
		key: "state",
		set: function set(value) {
			this._state = value;
			// console.log( Object.assign( {}, this._state) );
		}
	}]);

	return DemoPanel;
}(Laya.Sprite);

exports.default = DemoPanel;

/***/ }),
/* 6 */
/* no static exports found */
/* all exports used */
/*!***********************************!*\
  !*** ./script/components/Lapa.js ***!
  \***********************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = __webpack_require__(/*! ./../utils/util */ 1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Laya = Laya,
    Stage = _Laya.Stage,
    Sprite = _Laya.Sprite,
    Image = _Laya.Image,
    Event = _Laya.Event,
    Handler = _Laya.Handler,
    Text = _Laya.Text,
    Tween = _Laya.Tween,
    Ease = _Laya.Ease,
    TimeLine = _Laya.TimeLine;


var B_WIDTH = 128;
var B_HEIGHT = 128;

var LA_ROWS = 3;
var LA_COLUMNS = 6;

var LapaLine = function (_Laya$Sprite) {
	_inherits(LapaLine, _Laya$Sprite);

	function LapaLine(rowNum) {
		_classCallCheck(this, LapaLine);

		var _this = _possibleConstructorReturn(this, (LapaLine.__proto__ || Object.getPrototypeOf(LapaLine)).call(this));

		_this._lineList = [];
		_this._tempList1 = [];
		_this._tempList2 = [];
		_this._stop = false;

		_this.rowNum = rowNum;
		_this._render();

		Laya.timer.once(1000, _this, _this.go);
		return _this;
	}

	_createClass(LapaLine, [{
		key: "_render",
		value: function _render() {
			this.cont0 = new Sprite();
			this.cont1 = new Sprite();
			this.cont1.y = B_HEIGHT * 3;
			this.addChildren(this.cont0, this.cont1);
			for (var i = 0; i < 3; i++) {
				this._lineList.push(1);
				var icon = new Image();
				icon.scale(120 / 256, 120 / 256);
				icon.skin = "lapa/g" + (0, _util.random)(18, 1) + ".png";
				icon.y = i * B_HEIGHT;
				this.cont0.addChild(icon);

				var icon2 = new Image();
				icon2.scale(120 / 256, 120 / 256);
				icon2.skin = "lapa/g" + (0, _util.random)(18, 1) + ".png";
				icon2.y = i * B_HEIGHT;
				this.cont1.addChild(icon2);
			}
		}
	}, {
		key: "reset",
		value: function reset() {
			for (var i = 0; i < LA_ROWS; i++) {
				this.cont0.getChildAt(i).skin = "lapa/g" + (0, _util.random)(18, 1) + ".png";
				this.cont1.getChildAt(i).skin = "lapa/g" + (0, _util.random)(18, 1) + ".png";
			}
		}
	}, {
		key: "go",
		value: function go() {
			var _this2 = this;

			this._aniStart();
			setTimeout(function () {
				return _this2.result = 4;
			}, 2000);
		}
	}, {
		key: "_aniStart",
		value: function _aniStart() {
			Tween.to(this, { y: -B_HEIGHT * LA_ROWS }, 660, Ease.sineIn, Handler.create(this, this._aniLoop, [1]));
		}
	}, {
		key: "_aniLoop",
		value: function _aniLoop(flag) {
			switch (flag) {
				case 1:
					this.cont0.y = B_HEIGHT * LA_ROWS * 2;
					Tween.to(this, { y: -B_HEIGHT * LA_ROWS * 2 }, 330, null, Handler.create(this, this._aniLoop, [2]));
					break;
				case 2:
					this.cont0.y = 0;
					this.y = 0;
					if (this.result) {
						return this._aniStop();
					}
					Tween.to(this, { y: -B_HEIGHT * LA_ROWS }, 330, null, Handler.create(this, this._aniLoop, [1]));
					break;
			}
		}
	}, {
		key: "_aniStop",
		value: function _aniStop() {
			var _this3 = this;

			var lCount = this.lCount || this.lCount === 0 ? this.lCount : this.rowNum;
			if (lCount === 0) {
				for (var i = 0; i < LA_ROWS; i++) {
					this.cont1.getChildAt(i).skin = "lapa/g" + 20 + ".png";
				}
				Tween.to(this, { y: -B_HEIGHT * 2.5 }, 2.5 * 110, null, Handler.create(this, function () {
					Tween.to(_this3, { y: -B_HEIGHT * LA_ROWS }, 900, Ease.elasticOut);
				}));
				this.lCount = null;
			} else if (lCount >= 1 && lCount <= LA_ROWS) {
				var tc = 0;
				for (var _i = lCount; _i <= LA_ROWS; _i++) {
					if (_i <= LA_ROWS) {
						tc = _i;
						this.cont1.getChildAt(_i - 1).skin = "lapa/g" + 20 + ".png";
					}
				}
				Tween.to(this, { y: -B_HEIGHT * LA_ROWS }, 330, null, Handler.create(this, function () {
					_this3.cont0.y = B_HEIGHT * LA_ROWS * 2;
					var s = LA_ROWS - tc;
					for (; s < LA_ROWS; s++) {
						_this3.cont0.getChildAt(s).skin = "lapa/g" + 20 + ".png";
					}
					Tween.to(_this3, { y: -B_HEIGHT * (lCount + 2.5) }, (lCount + 2.5) * 330 / LA_ROWS - 330, null, Handler.create(_this3, function () {
						Tween.to(_this3, { y: -B_HEIGHT * (lCount + LA_ROWS) }, 900, Ease.elasticOut);
					}));
				}));
				this.lCount = null;
			} else {
				this.lCount = lCount - LA_ROWS;
				Tween.to(this, { y: -B_HEIGHT * LA_ROWS }, 330, null, Handler.create(this, function () {
					_this3.cont0.y = B_HEIGHT * 6;
					Tween.to(_this3, { y: -B_HEIGHT * LA_ROWS * 2 }, 330, null, Handler.create(_this3, function () {
						_this3.cont0.y = 0;
						_this3.y = 0;
						_this3._aniStop();
					}));
				}));
			}
			if (!this.reset) {
				this.reset = true;
				setTimeout(this.reset.bind(this), 2000);
			}
		}
	}]);

	return LapaLine;
}(Laya.Sprite);

var Lapa = function (_Laya$Sprite2) {
	_inherits(Lapa, _Laya$Sprite2);

	function Lapa() {
		_classCallCheck(this, Lapa);

		var _this4 = _possibleConstructorReturn(this, (Lapa.__proto__ || Object.getPrototypeOf(Lapa)).call(this));

		_this4._init();
		_this4.scrollRect = new Laya.Rectangle(0, 0, B_WIDTH * 6, B_HEIGHT * LA_ROWS); // viewport
		return _this4;
	}

	_createClass(Lapa, [{
		key: "_init",
		value: function _init() {
			for (var i = 0; i < 6; i++) {
				var line = new LapaLine(i);
				line.x = i * B_WIDTH;
				this.addChild(line);
			}
		}
	}]);

	return Lapa;
}(Laya.Sprite);

exports.default = Lapa;

/***/ }),
/* 7 */
/* no static exports found */
/* all exports used */
/*!******************************************!*\
  !*** ./script/reducer/counterReducer.js ***!
  \******************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = counterReducer;

var counInfo = Immutable({ i: 0 });
function counterReducer() {
	var counter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : counInfo;
	var action = arguments[1];

	switch (action.type) {
		case 'INCREMENT':
			return counter.setIn(['i'], counter.i + action.payload.i // counter 是值传递，因此可以直接返回一个值
			);default:
			return counter;
	}
};

/***/ }),
/* 8 */
/* no static exports found */
/* all exports used */
/*!***********************************!*\
  !*** ./script/reducer/reducer.js ***!
  \***********************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _counterReducer = __webpack_require__(/*! ./counterReducer */ 7);

var _counterReducer2 = _interopRequireDefault(_counterReducer);

var _todosReducer = __webpack_require__(/*! ./todosReducer */ 9);

var _todosReducer2 = _interopRequireDefault(_todosReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _Redux = Redux,
    combineReducers = _Redux.combineReducers;
exports.default = combineReducers({
	counter: _counterReducer2.default, // 键名就是该 reducer 对应管理的 state
	todos: _todosReducer2.default
});

/***/ }),
/* 9 */
/* no static exports found */
/* all exports used */
/*!****************************************!*\
  !*** ./script/reducer/todosReducer.js ***!
  \****************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = todosReducer;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initTodo = Immutable([]);
function todosReducer() {
	var todos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initTodo;
	var action = arguments[1];

	switch (action.type) {
		case 'TODO':
			return [].concat(_toConsumableArray(todos), [action.payload]); // todos.merge(action.payload);
		default:
			return todos;
	}
};

/***/ }),
/* 10 */
/* no static exports found */
/* all exports used */
/*!*******************************!*\
  !*** ./script/store/store.js ***!
  \*******************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reducer = __webpack_require__(/*! ./../reducer/reducer */ 8);

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _Redux = Redux,
    createStore = _Redux.createStore,
    compose = _Redux.compose,
    applyMiddleware = _Redux.applyMiddleware;
exports.default = createStore(_reducer2.default, compose(applyMiddleware(ReduxThunk.default), window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : function (noop) {
	return noop;
}));

/*
var stateOld = store.getState();
store.subscribe(function(){
	var stateNew = store.getState();
})
*/

/***/ }),
/* 11 */
/* no static exports found */
/* all exports used */
/*!**********************************!*\
  !*** ./script/utils/laya.jsx.js ***!
  \**********************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Laya.createElement = function (type, config, children) {
  var propName;

  // 初始化参数
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  // 从config中提取出内容，如ref key props
  if (config != null) {
    ref = config.ref === undefined ? null : config.ref;
    key = config.key === undefined ? null : '' + config.key;
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;

    // 提取出config中的prop，放入props变量中
    for (propName in config) {
      if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // 处理children，挂到props的children属性下
  // 入参的前两个为type和config，后面的就都是children参数了。故需要减2
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    // 只有一个参数时，直接挂到children属性下，不是array的方式
    props.children = children;
  } else if (childrenLength > 1) {
    // 不止一个时，放到array中，然后将array挂到children属性下
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  // 取出组件类中的静态变量defaultProps，并给未在JSX中设置值的属性设置默认值
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  // 返回一个ReactElement对象
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
};

/***/ }),
/* 12 */
/* no static exports found */
/* all exports used */
/*!*****************************!*\
  !*** multi ./script/app.js ***!
  \*****************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! F:\Projects\laya-es6-webpack\script\app.js */2);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map