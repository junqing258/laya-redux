var { createStore, compose, applyMiddleware } = Redux;

import appReducer from "reducer/reducer";

export default createStore(appReducer, compose(
	applyMiddleware(ReduxThunk.default),
	window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : noop => noop
));

/*
var stateOld = store.getState();
store.subscribe(function(){
	var stateNew = store.getState();
})
*/