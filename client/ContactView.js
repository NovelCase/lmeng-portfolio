import React from 'react';
import * as PixiApp from '../pixi/projectStage.js';
import * as PIXI from 'pixi.js';

let width = window.outerWidth;
let height = window.outerHeight;

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
			PixiApp.helpButton.position.x =
				PixiApp.app.stage.pivot.x + PixiApp.app.renderer.view.width - 35;
		} else {
			if (PixiApp.app.renderer.view.width >= 800) {
				this.setState({ visible: true });
				PixiApp.app.renderer.view.width -= width / 4;
				PixiApp.helpButton.position.x =
					PixiApp.app.stage.pivot.x + PixiApp.app.renderer.view.width - 35;
			} else
				window.open(
					'https://open.spotify.com/embed/playlist/4R4hOYnM63VAOTzfgqAR48',
					'_blank'
				);
		}
	}

	render() {
		return (
			<div>
				{this.state.visible ? (
					<div id="container">
						<iframe
							src="https://open.spotify.com/embed/playlist/4R4hOYnM63VAOTzfgqAR48"
							width={width / 4}
							height={height}
							// frameborder='0'
							allowtransparency="true"
							allow="encrypted-media"
						></iframe>
						<div id="loading">
							<div id="anim-radio">
								<img src="/siteAssets/radio.png" />
							</div>
							<h1>Loading! Please Wait...</h1>
						</div>
					</div>
				) : (
					<></>
				)}
			</div>
		);
	}
}
