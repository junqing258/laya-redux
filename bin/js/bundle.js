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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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


var _Connect = __webpack_require__(/*! ./utils/Connect */ 1);

var _Laya = Laya,
    Stage = _Laya.Stage,
    Sprite = _Laya.Sprite,
    Event = _Laya.Event,
    Handler = _Laya.Handler,
    Text = _Laya.Text;
var _Redux = Redux,
    combineReducers = _Redux.combineReducers,
    createStore = _Redux.createStore,
    compose = _Redux.compose,
    applyMiddleware = _Redux.applyMiddleware;


var stage;
Laya.init(1334, 750, Laya.WebGL);
stage = Laya.stage;
stage.scaleMode = Stage.SCALE_FIXED_WIDTH;
stage.alignH = Stage.ALIGN_CENTER;
stage.alignV = Stage.ALIGN_MIDDLE;
stage.screenMode = Stage.SCREEN_HORIZONTAL;

var txt1 = new Text();
txt1.color = '#FFFFFF';
txt1.fontSize = 32;
txt1.pos(40, 40);
stage.addChild(txt1);

var txt2 = new Text();
txt2.color = '#FFFFFF';
txt2.fontSize = 32;
txt2.pos(40, 140);
stage.addChild(txt2);

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

var appReducer = combineReducers({
	counter: counterReducer, // 键名就是该 reducer 对应管理的 state
	todos: todosReducer
});

var appStore = createStore(appReducer, compose(applyMiddleware(ReduxThunk.default), window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : function (noop) {
	return noop;
}));
_Connect.Connect.use(appStore);

(0, _Connect.Connect)("counter.i", txt1, function (state) {
	this.text = JSON.stringify(state);
});

(0, _Connect.Connect)("todos", txt2, function (state) {
	this.text = JSON.stringify(state);
});

appStore.dispatch({
	type: 'TODO',
	payload: { a: 12 }
});
appStore.dispatch({
	type: 'INCREMENT',
	payload: { i: 2 }
});

appStore.dispatch(function () {
	return function (dispatch, getState) {
		setTimeout(function () {
			return dispatch({
				type: 'TODO',
				payload: { c: 12 }
			});
		}, 1000);
	};
}());

appStore.dispatch(function () {
	return function (dispatch, getState) {
		setTimeout(function () {
			return dispatch({
				type: 'FFF',
				payload: { d: 12 }
			});
		}, 8000);
	};
}());

/***/ }),
/* 1 */
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

var _util = __webpack_require__(/*! ./util */ 2);

var subList = {};

function Connect(path, component, bindState) {
	/*var i = path.indexOf(".");
 var module = path.substr(0, i);
 var pathIn = path.substring(i+1)
 var state = Connect.store[module];*/
	if (!subList[path]) {
		subList[path] = [component];
	} else {
		subList[path].push(component);
	}

	bindState && (component.bindState = bindState);
	if (typeof component.bindState === "function") {
		var paths = path.split(".");
		var _state = (0, _util.getIn)(Connect.store, path);
		component.state = _state;
		component.bindState.call(component, _state);
	}
}

Connect.use = function (store) {
	Connect.store = store;
	var unsubscribe = store.subscribe(function () {
		Object.keys(subList).forEach(function (path, i) {
			var components = subList[path];
			components.forEach(function (component, i) {
				var _state = (0, _util.getIn)(Connect.store, path);
				if (component.state !== _state) {
					component.state = _state;
					component.bindState.call(component, _state);
				}
			});
		});
	});
};

/***/ }),
/* 2 */
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
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";
  var uuid = s.join("");
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
/* 3 */
/* no static exports found */
/* all exports used */
/*!*****************************!*\
  !*** multi ./script/app.js ***!
  \*****************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! F:\Projects\laya-es6-webpack\script\app.js */0);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map