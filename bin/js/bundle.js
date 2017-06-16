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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/* no static exports found */
/* all exports used */
/*!***********************!*\
  !*** ./script/app.js ***!
  \***********************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Connect = __webpack_require__(/*! ./utils/Connect */ 3);

var _Connect2 = _interopRequireDefault(_Connect);

var _store = __webpack_require__(/*! ./store/store */ 11);

var _store2 = _interopRequireDefault(_store);

var _DemoPanel = __webpack_require__(/*! ./components/DemoPanel */ 9);

var _DemoPanel2 = _interopRequireDefault(_DemoPanel);

var _Lapa = __webpack_require__(/*! ./components/Lapa */ 15);

var _Lapa2 = _interopRequireDefault(_Lapa);

var _action = __webpack_require__(/*! ./actions/action */ 13);

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

_Connect2.default.use(_store2.default);

var panel = new _DemoPanel2.default();
stage.addChild(panel);

/**
 * test code
 */

_store2.default.dispatch((0, _action.increment)({ i: 12 }));

_store2.default.dispatch((0, _action.todo)({ cc: 12 }));
_store2.default.dispatch((0, _action.todo)({ dd: 12 }));

setTimeout(function () {
	_store2.default.dispatch((0, _action.todo)({ ff: 12 }));
}, 2000);

setTimeout(function () {
	_store2.default.dispatch((0, _action.increment)({ i: 8 }));
}, 3000);

Laya.loader.load([{ url: "res/atlas/lapa.json", type: "atlas" }], Handler.create(null, function () {
	stage.addChild(new _Lapa2.default());
}));

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
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

var _util = __webpack_require__(/*! ./util */ 4);

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

Connect.use = function (store) {
	if (Connect.store) {
		console.warn("store be used");
	}
	Connect.store = store;
	var unsubscribe = store.subscribe(function () {
		Object.keys(subList).forEach(function (path, i) {
			Object.keys(subList[path]).forEach(function (uuid, i) {
				var component = subList[path][uuid];
				var _state = (0, _util.getIn)(Connect.store, path);
				if (component.displayedInStage === false || component.destroyed) {
					delete subList[path][uuid];
					return;
				}
				if (component.state !== _state) {
					component.state = _state;
					if (typeof component.bindState === "function") {
						component.bindState(_state);
					}
				}
			});
		});
	});
};

/***/ }),
/* 4 */
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

/***/ }),
/* 5 */
/* no static exports found */
/* all exports used */
/*!*****************************!*\
  !*** multi ./script/app.js ***!
  \*****************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\Users\zhangjunqing\git\laya-es6-webpack\script\app.js */0);


/***/ }),
/* 6 */,
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
/* 9 */
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

var _Connect = __webpack_require__(/*! ./../utils/Connect */ 3);

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
			console.log(Object.assign({}, this._state));
		}
	}]);

	return DemoPanel;
}(Laya.Sprite);

exports.default = DemoPanel;

/***/ }),
/* 10 */,
/* 11 */
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

var _reducer = __webpack_require__(/*! ./../reducer/reducer */ 12);

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
/* 12 */
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

var _todosReducer = __webpack_require__(/*! ./todosReducer */ 8);

var _todosReducer2 = _interopRequireDefault(_todosReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _Redux = Redux,
    combineReducers = _Redux.combineReducers;
exports.default = combineReducers({
	counter: _counterReducer2.default, // 键名就是该 reducer 对应管理的 state
	todos: _todosReducer2.default
});

/***/ }),
/* 13 */
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
/* 14 */,
/* 15 */
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Laya = Laya,
    Stage = _Laya.Stage,
    Sprite = _Laya.Sprite,
    Event = _Laya.Event,
    Handler = _Laya.Handler,
    Text = _Laya.Text,
    Tween = _Laya.Tween,
    Ease = _Laya.Ease,
    TimeLine = _Laya.TimeLine;

var LapaLine = function (_Laya$Sprite) {
	_inherits(LapaLine, _Laya$Sprite);

	function LapaLine() {
		var _ref;

		_classCallCheck(this, LapaLine);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		var _this = _possibleConstructorReturn(this, (_ref = LapaLine.__proto__ || Object.getPrototypeOf(LapaLine)).call.apply(_ref, [this].concat(args)));

		_this._lineList = [];
		_this._tempList1 = [];
		_this._tempList2 = [];

		_this._render();

		Laya.timer.once(4000, _this, function () {
			_this.go();
		});
		return _this;
	}

	_createClass(LapaLine, [{
		key: "_render",
		value: function _render() {
			this.cont0 = new Sprite();
			this.cont1 = new Sprite();
			this.cont1.y = 70 * 3;
			this.addChildren(this.cont0, this.cont1);
			for (var i = 0; i < 3; i++) {
				this._lineList.push(1);
				var icon = new Sprite();
				icon.loadImage("lapa/1.png");
				icon.y = i * 70;
				this.cont0.addChild(icon);

				var icon2 = new Sprite();
				icon2.loadImage("lapa/1.png");
				icon2.y = i * 70;
				this.cont1.addChild(icon2);
			}
		}
	}, {
		key: "go",
		value: function go() {
			this._startAni();
		}
	}, {
		key: "_startAni",
		value: function _startAni() {
			Tween.to(this, { y: -70 * 3 }, 250, Ease.bounceIn, Handler.create(this, this._loopAni));
			this._head = 1;
		}
	}, {
		key: "_loopAni",
		value: function _loopAni() {
			switch (this._head) {
				case 1:
					this.cont0.y = 70 * 6;
					this._head = 2;
					Tween.to(this, { y: -70 * 6 }, 200, null, Handler.create(this, this._loopAni));
					break;
				case 2:
					this.cont0.y = 0;
					this.y = 0;
					Tween.to(this, { y: -70 * 3 }, 200, null, Handler.create(this, this._loopAni));
					this._head = 1;
					break;
			}
		}
	}, {
		key: "_stopAni",
		value: function _stopAni() {}
	}]);

	return LapaLine;
}(Laya.Sprite);

var Lapa = function (_Laya$Sprite2) {
	_inherits(Lapa, _Laya$Sprite2);

	function Lapa() {
		var _ref2;

		_classCallCheck(this, Lapa);

		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			args[_key2] = arguments[_key2];
		}

		var _this2 = _possibleConstructorReturn(this, (_ref2 = Lapa.__proto__ || Object.getPrototypeOf(Lapa)).call.apply(_ref2, [this].concat(args)));

		_this2._init();
		_this2.pos(500, 100);
		_this2.scrollRect = new Laya.Rectangle(0, 0, 70 * 6, 70 * 3);
		return _this2;
	}

	_createClass(Lapa, [{
		key: "_init",
		value: function _init() {
			for (var i = 0; i < 6; i++) {
				var line = new LapaLine();
				line.x = i * 70;
				this.addChild(line);
			}
		}
	}]);

	return Lapa;
}(Laya.Sprite);

exports.default = Lapa;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map