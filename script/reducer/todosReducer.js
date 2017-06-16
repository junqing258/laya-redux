
var initTodo = Immutable({});
export default function todosReducer(todos = initTodo, action) {
	switch (action.type) {
		case 'TODO':
			return todos.merge(action.payload); //[ ...todos, action.payload ]//
		default:
			return todos
	}
};