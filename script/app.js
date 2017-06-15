var { Stage, Sprite, Event, Handler, Text } = Laya;
var { combineReducers, createStore, compose, applyMiddleware } = Redux;

import { Connect } from './utils/Connect';

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
function todosReducer(todos = initTodo, action) {
	switch (action.type) {
		case 'TODO':
			return todos.merge(action.payload); //[ ...todos, action.payload ]//
		default:
			return todos
	}
};
var counInfo = Immutable({ i: 0});
function counterReducer(counter = counInfo, action) {
	switch (action.type) {
		case 'INCREMENT':
			return counter.setIn(['i'], counter.i+action.payload.i) // counter 是值传递，因此可以直接返回一个值
		default:
			return counter
	}
};


const appReducer = combineReducers({
	counter: counterReducer, // 键名就是该 reducer 对应管理的 state
	todos: todosReducer
});

var appStore = createStore(appReducer, compose(
	applyMiddleware(ReduxThunk.default),
	window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : noop => noop
));
Connect.initStore(appStore);



Connect("counter.i", txt1, function(state) {
	this.text = JSON.stringify(state)
});

Connect("todos", txt2, function(state) {
	this.text = JSON.stringify(state)
});

appStore.dispatch({
	type: 'TODO',
	payload: { a: 12 }
});
appStore.dispatch({
	type: 'INCREMENT',
	payload: { i: 2 }
});


appStore.dispatch((() => {
	return (dispatch, getState) => {
		setTimeout(() => dispatch({
			type: 'TODO',
			payload: { c: 12 }
		}), 1000);
	}
})());


appStore.dispatch((() => {
	return (dispatch, getState) => {
		setTimeout(() => dispatch({
			type: 'FFF',
			payload: { d: 12 }
		}), 8000);
	}
})());

