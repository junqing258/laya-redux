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

var _store = __webpack_require__(/*! ./store/store */ 11);

var _store2 = _interopRequireDefault(_store);

var _DemoPanel = __webpack_require__(/*! ./components/DemoPanel */ 9);

var _DemoPanel2 = _interopRequireDefault(_DemoPanel);

var _actions = __webpack_require__(/*! ./actions */ 1);

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

_Connect.Connect.use(_store2.default);

var panel = new _DemoPanel2.default();
stage.addChild(panel);

_store2.default.dispatch((0, _actions.increment)({ i: 12 }));

_store2.default.dispatch((0, _actions.todo)({ cc: 12 }));
_store2.default.dispatch((0, _actions.todo)({ dd: 12 }));

setTimeout(function () {
	_store2.default.dispatch((0, _actions.todo)({ ff: 12 }));
}, 2000);

setTimeout(function () {
	_store2.default.dispatch((0, _actions.increment)({ i: 8 }));
}, 3000);

/***/ }),
/* 1 */
/* no static exports found */
/* all exports used */
/*!*********************************!*\
  !*** ./script/actions/index.js ***!
  \*********************************/
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
exports.Connect = Connect;

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
	if (typeof component.bindState === "function") {
		var paths = path.split(".");
		var _state = (0, _util.getIn)(Connect.store, path);
		component.state = _state;
		component.bindState(_state);
	}
}

Connect.use = function (store) {
	Connect.store = store;
	var unsubscribe = store.subscribe(function () {
		Object.keys(subList).forEach(function (path, i) {
			var components = subList[path];
			Object.keys(subList[path]).forEach(function (uuid, i) {
				var component = subList[path][uuid];
				var _state = (0, _util.getIn)(Connect.store, path);
				if (component.displayedInStage === false || component.destroyed) {
					delete subList[path][uuid];
					return;
				}
				if (component.state !== _state) {
					component.state = _state;
					component.bindState(_state);
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
/* 6 */
/* no static exports found */
/* all exports used */
/*!**************************************!*\
  !*** ./script/reducer/appReducer.js ***!
  \**************************************/
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

var initTodo = Immutable({});
function todosReducer() {
	var todos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initTodo;
	var action = arguments[1];

	switch (action.type) {
		case 'TODO':
			return todos.merge(action.payload); //[ ...todos, action.payload ]//
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
		return _this;
	}

	_createClass(DemoPanel, [{
		key: '_render',
		value: function _render() {
			var txt1 = new Text();
			txt1.color = '#FFFFFF';
			txt1.fontSize = 32;
			txt1.pos(40, 40);
			this.addChild(txt1);
			(0, _Connect.Connect)("counter.i", txt1, function (state) {
				txt1.text = JSON.stringify(state);
			});

			var txt2 = new Text();
			txt2.color = '#FFFFFF';
			txt2.fontSize = 32;
			txt2.pos(40, 140);
			this.addChild(txt2);
			(0, _Connect.Connect)("todos", txt2, function (state) {
				txt2.text = JSON.stringify(state);
			});
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

var _appReducer = __webpack_require__(/*! ./../reducer/appReducer */ 6);

var _appReducer2 = _interopRequireDefault(_appReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _Redux = Redux,
    createStore = _Redux.createStore,
    compose = _Redux.compose,
    applyMiddleware = _Redux.applyMiddleware;
exports.default = createStore(_appReducer2.default, compose(applyMiddleware(ReduxThunk.default), window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : function (noop) {
	return noop;
}));

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map