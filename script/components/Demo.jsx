


export default class Demo {

	render() {
		var profile = (
			<Sprite>
				<Image src="avatar.png" x={20} />
				<Text>{[user.firstName, user.lastName].join(' ')}</Text>
			</Sprite>
		);
		

	}

}