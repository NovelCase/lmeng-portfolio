import React from 'react';
import * as PixiApp from '../pixi/projectStage';
import * as PIXI from 'pixi.js';

let menu = {
	ham: '/siteAssets/hamburger.png',
	hamHover: '/siteAssets/hamRoll.png',
	closed: '/siteAssets/x-mark.png',
	closedHover: '/siteAssets/x-roll.png',
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
		this.moveView = this.moveView.bind(this);
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
		} else {
			this.setState({ menu: 'closed', visible: true });
		}
	}
	moveView(num) {
		{
			PixiApp.shadow.visible = false;
			PixiApp.popUpProject.removeChildren();
			PixiApp.popUpProject.visible = false;
			PixiApp.app.stage.pivot.x = PixiApp.app.renderer.view.width * num;
			this.onClickTap();
			PixiApp.helpButton.position.x =
				PixiApp.app.stage.pivot.x + PixiApp.app.renderer.view.width - 35;
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
						<h1 onClick={() => this.moveView(0)}>Home</h1>
						<h1 onClick={() => this.moveView(1)}>Projects</h1>
						<h1 onClick={() => this.moveView(2)}>About Me</h1>
						<h1 onClick={() => this.moveView(3)}>Contact</h1>
					</div>
				) : (
					<></>
				)}
			</div>
		);
	}
}
