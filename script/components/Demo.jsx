


export default class Demo {

	handClick(data) {
		
	}

	render() {
		var profile = (
			<Sprite onClick={this.handClick.bind(this)}>
				<Image src="avatar.png" x={20} />
				<Text>{[user.firstName, user.lastName].join(' ')}</Text>
			</Sprite>
		);
		

	}

}