import React from 'react';
import * as PixiApp from '../pixi/projectStage.js';
import * as PIXI from 'pixi.js';

let width = PixiApp.appWidth;
let height = PixiApp.appHeight;

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
			PixiApp.secondMonstera.position.x,
			PixiApp.secondMonstera.position.y + PixiApp.scale.radio * 15,
			radioText,
			'radio'
		);
		radio.on('pointertap', () => {
			this.onClickTap();
		});
	}

	onClickTap() {
		if (this.state.visible) {
			this.setState({ visible: false });
			PixiApp.app.stage.pivot.x = width * 3;
			PixiApp.app.renderer.view.width += width / 4;
		} else {
			this.setState({ visible: true });
			PixiApp.app.renderer.view.width -= width / 4;
		}
	}

	render() {
		return (
			<div>
				{this.state.visible ? (
					<iframe
						src="https://open.spotify.com/embed/playlist/4R4hOYnM63VAOTzfgqAR48"
						width={width / 4}
						height={height}
						// frameborder='0'
						allowtransparency="true"
						allow="encrypted-media"
					></iframe>
				) : (
					<></>
				)}
			</div>
		);
	}
}
