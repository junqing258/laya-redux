var { createStore, compose, applyMiddleware } = Redux;

import appReducer from "./../reducer/appReducer";

export default createStore(appReducer, compose(
	applyMiddleware(ReduxThunk.default),
	window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : noop => noop
));