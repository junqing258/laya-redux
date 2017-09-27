
var counInfo = Immutable({ i: 0});
export default function counterReducer(counter = counInfo, action) {
	switch (action.type) {
		case 'INCREMENT':
			return counter.setIn(['i'], counter.i+action.payload.i) // counter 是值传递，因此可以直接返回一个值
		default:
			return counter
	}
};