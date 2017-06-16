
var initTodo = Immutable([]);
export default function todosReducer(todos = initTodo, action) {
	switch (action.type) {
		case 'TODO':
			return [ ...todos, action.payload ]; // todos.merge(action.payload);
		default:
			return todos
	}
};