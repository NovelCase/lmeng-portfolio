import React from 'react';
import * as PixiApp from '../pixi/projectStage';
import * as PIXI from 'pixi.js';

let menu = {
	ham: '/siteAssets/hamburger.png',
	hamHover: '/siteAssets/hamPurp.png',
	closed: '/siteAssets/x-mark.png',
	closedHover: '/siteAssets/xPurp.png',
};
export default class Menu extends React.Component {
	constructor() {
		super();
		this.state = {
			visible: false,
			menu: 'ham',
		};
		this.onClickTap = this.onClickTap.bind(this);
		this.onPointerOut = this.onPointerOut.bind(this);
		this.onPointerOver = this.onPointerOver.bind(this);
	}
	componentDidMount() {}
	onPointerOver() {
		let newImg = this.state.menu + 'Hover';
		this.setState({ ...this.state, menu: newImg });
	}
	onPointerOut() {
		if (this.state.menu === 'closedHover')
			this.setState({ ...this.state, menu: 'closed' });
		else if (this.state.menu === 'hamHover')
			this.setState({ ...this.state, menu: 'ham' });
	}
	onClickTap() {
		if (this.state.visible) {
			this.setState({ menu: 'ham', visible: false });
			// menuSprite.texture = hamMenu;
		} else {
			this.setState({ menu: 'closed', visible: true });
			// menuSprite.texture = closedIcon;
		}
	}

	render() {
		return (
			<div>
				<img
					className="hamburger"
					onPointerOver={this.onPointerOver}
					onPointerOut={this.onPointerOut}
					onClick={this.onClickTap}
					src={menu[this.state.menu]}
				/>
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
					<></>
				)}
			</div>
		);
	}
}
