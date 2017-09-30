import counterReducer from "./counterReducer";
import todosReducer from "./todosReducer";

var { combineReducers } = Redux;

export default combineReducers({
	counter: counterReducer, // 键名就是该 reducer 对应管理的 state
	todos: todosReducer
});