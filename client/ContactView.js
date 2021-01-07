import React from 'react';
import * as PixiApp from '../pixi/projectStage.js';
import * as PIXI from 'pixi.js';

let width = PixiApp.appWidth;
let height = PixiApp.appHeight;
let transparent;
//let visible = PixiApp.visible;

export default class Contact extends React.Component {
	constructor() {
		super();
		this.state = {
			visible: false,
		};
		this.onClickTap = this.onClickTap.bind(this);
	}
	componentDidMount() {
		let radioText = PIXI.Texture.from('/siteAssets/radio.png');
		let radio = PixiApp.createSprite(
			(width / 2) * 7.4,
			(height / 4) * 2.4 + 10 * PixiApp.scale.radio,
			radioText,
			'radio'
		);
		radio.on('mouseover', () => (radio.tint = 0x007ec7));
		radio.on('mouseout', () => (radio.tint = 0xffffff));
		radio.on('click', () => {
			this.onClickTap();
			console.log('hi');
		});
		radio.on('tap', () => this.onClickTap());
	}

	onClickTap() {
		if (this.state.visible) {
			this.setState({ visible: false });
			PixiApp.app.stage.pivot.x = width * 3;
		} else {
			this.setState({ visible: true });
		}
	}

	render() {
		console.log('visible? ', this.state.visible);
		return (
			<div>
				{this.state.visible ? (
					<iframe
						src='https://open.spotify.com/embed/playlist/4R4hOYnM63VAOTzfgqAR48'
						width={width / 4}
						height={height}
						// frameborder='0'
						allowtransparency='true'
						allow='encrypted-media'
					></iframe>
				) : (
					<div />
				)}
			</div>
		);
	}
}
