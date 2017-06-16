
export function todo(item) {
	return (dispatch, getState) => {
		setTimeout(() => dispatch({
			type: 'TODO',
			payload: item
		}), 2000);
	}
}

export function increment(p) {
	return {
		type: 'INCREMENT',
		payload: p
	}
}
