import React from 'react';
import * as PixiApp from '../pixi/projectStage';
import * as PIXI from 'pixi.js';

let width = PixiApp.app.renderer.view.width;
let height = PixiApp.app.renderer.view.height;
const hamMenu = PIXI.Texture.from('/siteAssets/hamburger.png');
const hamHover = PIXI.Texture.from('/siteAssets/hamPurp.png');
const closedIcon = PIXI.Texture.from('/siteAssets/x-mark.png');
const closeHover = PIXI.Texture.from('/siteAssets/xPurp.png');
let menuSprite;

export default class Menu extends React.Component {
	constructor() {
		super();
		this.state = {
			visible: false,
		};
		this.onClickTap = this.onClickTap.bind(this);
	}
	componentDidMount() {
		menuSprite = new PIXI.Sprite(hamMenu);
		PixiApp.menuContainer.addChild(menuSprite);
		//menuSprite.anchor.set(0.5);
		menuSprite.interactive = true;
		menuSprite.buttonMode = true;
		if (window.outerWidth <= 400) {
			menuSprite.scale.set(0.9);
		} else menuSprite.scale.set(1.1);
		menuSprite.position.y = 20;
		menuSprite.position.x = 20;

		menuSprite.on('pointertap', () => {
			this.onClickTap();
		});
		menuSprite.on('pointerover', function () {
			if (this.texture === hamMenu) {
				this.texture = hamHover;
			} else {
				this.texture = closeHover;
			}
		});
		menuSprite.on('pointerout', function () {
			if (this.texture === hamHover || this.texture === hamMenu) {
				this.texture = hamMenu;
			} else {
				this.texture = closedIcon;
			}
		});
	}

	onClickTap() {
		if (this.state.visible) {
			this.setState({ visible: false });
			menuSprite.texture = hamMenu;
		} else {
			this.setState({ visible: true });
			menuSprite.texture = closedIcon;
		}
	}

	render() {
		return (
			<div>
				{this.state.visible ? (
					<div className="menu">
						<h1
							onClick={() => {
								PixiApp.app.stage.pivot.x = 0;
								PixiApp.menuContainer.position.x = 20;
								this.onClickTap();
							}}
						>
							Home
						</h1>
						<h1
							onClick={() => {
								PixiApp.app.stage.pivot.x = PixiApp.app.renderer.view.width;
								PixiApp.menuContainer.position.x =
									PixiApp.app.renderer.view.width + 20;
								this.onClickTap();
							}}
						>
							Projects
						</h1>
						<h1
							onClick={() => {
								PixiApp.app.stage.pivot.x = PixiApp.app.renderer.view.width * 2;
								PixiApp.menuContainer.position.x =
									PixiApp.app.renderer.view.width * 2 + 20;
								this.onClickTap();
							}}
						>
							About Me
						</h1>
						<h1
							onClick={() => {
								PixiApp.app.stage.pivot.x = PixiApp.app.renderer.view.width * 3;
								PixiApp.menuContainer.position.x =
									PixiApp.app.renderer.view.width * 3 + 20;
								this.onClickTap();
							}}
						>
							Contact
						</h1>
					</div>
				) : (
					<div />
				)}
			</div>
		);
	}
}
