import React from 'react';
import * as PixiApp from '../pixi/projectStage.js';
import * as PIXI from 'pixi.js';
const { text } = require('../data');

let roomWidthProject = 2.5;
let roomWidthAbout = 4.5;
let turnOnInteractive = [];

export const onClick = (type, title, itemArr) => {
	if (type === 'about') {
		popUpAbout.visible = true;
		redXAbout.visible = true;
		about = title;
		if (textInfo[`${title}GoodReads`]) {
			textInfo[`${title}GoodReads`].visible = true;
		}
	} else {
		popUpProject.visible = true;
		redXProject.visible = true;
		textInfo[`${title}Github`].visible = true;
		textInfo[`${title}Live`].visible = true;
		project = title;
	}
	textInfo[title].visible = true;
	textInfo[`${title}Description`].visible = true;
	itemArr.forEach((item) => turnOnInteractive.push(item));
};
let about;
let project;
let popUpProject;
let redXProject;
let popUpAbout;
let redXAbout;
let textInfo = {};
export default class Project extends React.Component {
	createPopUpRect(x, y, type) {
		let width = window.innerWidth / 2;
		let height = window.innerHeight / 2;
		if (window.innerWidth < 400 && type === 'project') {
			width = window.innerWidth;
			height = (window.innerHeight / 4) * 3;
			x = window.innerWidth;
			y = (window.innerHeight / 2) * 0.2;
		} else if (window.innerWidth < 400) {
			width = window.innerWidth;
			height = (window.innerHeight / 4) * 3;
			x = window.innerWidth * 2;
			y = (window.innerHeight / 2) * 0.2;
		}
		const rect = new PIXI.Graphics();
		rect.beginFill(0xf4f5e7).drawRoundedRect(x, y, width, height, 20).endFill();
		rect.visible = false;
		PixiApp.popUps.addChild(rect);
		return rect;
	}
	createRedX(x, y, type) {
		if (window.innerWidth < 400 && type === 'project') {
			x = (window.innerWidth / 2) * 2.2;
			y = (window.innerHeight / 4) * 0.6;
		} else if (window.innerWidth < 400) {
			x = (window.innerWidth / 2) * 4.2;
			y = (window.innerHeight / 4) * 0.6;
		}
		const redXTexture = PIXI.Texture.from('/siteAssets/x-mark.png');
		const redX = new PIXI.Sprite(redXTexture);
		redX.position.x = x;
		redX.position.y = y;
		redX.anchor.set(0.5);
		redX.visible = false;
		redX.interactive = true;
		redX.buttonMode = true;
		PixiApp.popUps.addChild(redX);
		return redX;
	}
	openLink(projectName, linkType) {
		let link;
		if (linkType === 'Github' || linkType === 'GoodReads') {
			link = 'linkOneUrl';
		} else {
			link = 'linkTwoUrl';
		}
		window.open(`${text[projectName][link]}`);
	}
	createText(words, style, x, y, interactive, type) {
		const smallProject = {
			projectTitle: {
				y: (window.innerHeight / 2) * 0.4,
			},
			projectDescription: {
				y: (window.innerHeight / 2) * 0.55,
			},
			projectGithub: {
				x: (window.innerWidth / 2) * 2.2,
			},
			projectLive: {
				x: (window.innerWidth / 2) * 2.7,
			},
			aboutTitle: {
				y: (window.innerHeight / 2) * 0.4,
			},
			aboutDescription: {
				y: (window.innerHeight / 2) * 0.65,
			},
			aboutGoodReads: {
				x: (window.innerWidth / 2) * 4.2,
			},
		};
		const styleTwo = { ...style };
		if (window.innerWidth < 400 && type.includes('project')) {
			smallProject[type].x
				? (x = smallProject[type].x)
				: (x = (window.innerWidth / 2) * 2.2);
			smallProject[type].y
				? (y = smallProject[type].y)
				: (y = (window.innerHeight / 4) * 2.95);
			styleTwo.fontSize = styleTwo.fontSize - 5;
		} else if (window.innerWidth < 400) {
			smallProject[type].x
				? (x = smallProject[type].x)
				: (x = (window.innerWidth / 2) * 4.2);
			smallProject[type].y
				? (y = smallProject[type].y)
				: (y = (window.innerHeight / 4) * 2.95);
			styleTwo.fontSize = styleTwo.fontSize - 5;
		}
		const text = new PIXI.Text(words, styleTwo);
		text.visible = false;
		text.position.x = x;
		text.position.y = y;
		if (interactive) {
			text.interactive = true;
			text.buttonMode = true;
		}
		PixiApp.text.addChild(text);
		return text;
	}
	componentDidMount() {
		/* Pop Up for Project View */
		popUpProject = this.createPopUpRect(
			(window.innerWidth / 2) * roomWidthProject,
			(window.innerHeight / 2) * 0.5,
			'project'
		);

		/* Pop Up for About view */
		popUpAbout = this.createPopUpRect(
			(window.innerWidth / 2) * roomWidthAbout,
			(window.innerHeight / 2) * 0.5,
			'about'
		);

		/* redX for Project view */
		redXProject = this.createRedX(
			(window.innerWidth / 2) * (roomWidthProject + 0.05),
			(window.innerHeight / 3) * 0.9,
			'project'
		);
		redXProject.on('pointertap', () => {
			popUpProject.visible = false;
			redXProject.visible = false;
			textInfo[project].visible = false;
			textInfo[`${project}Description`].visible = false;
			textInfo[`${project}Github`].visible = false;
			textInfo[`${project}Live`].visible = false;
			turnOnInteractive.forEach((project) => (project.interactive = true));
			turnOnInteractive = [];
		});

		/* redX for About view */
		redXAbout = this.createRedX(
			(window.innerWidth / 2) * (roomWidthAbout + 0.05),
			(window.innerHeight / 3) * 0.9,
			'about'
		);
		redXAbout.on('pointertap', () => {
			popUpAbout.visible = false;
			redXAbout.visible = false;
			textInfo[about].visible = false;
			textInfo[`${about}Description`].visible = false;
			if (textInfo[`${about}GoodReads`])
				textInfo[`${about}GoodReads`].visible = false;
			turnOnInteractive.forEach((about) => (about.interactive = true));
			turnOnInteractive = [];
		});

		/* Styling */
		let titleStyle = {
			fontFamily: 'Montserrat',
			fontSize: 35,
			fontWeight: '600',
			wordWrap: true,
			wordWrapWidth: (popUpProject.width / 4) * 3,
		};
		let descriptionStyle = {
			fontFamily: 'Montserrat',
			fontSize: 23,
			fontWeight: '400',
			lineHeight: popUpProject.height / 16,
			wordWrap: true,
			wordWrapWidth: (popUpProject.width / 4) * 3,
		};
		let linkStyle = {
			fontFamily: 'Montserrat',
			fontSize: 23,
			fill: '#007EC7',
		};

		/* Promise Project */
		textInfo.promise = this.createText(
			`${text.promiseHS.name} -`,
			titleStyle,
			(popUpProject.width / 2) * (roomWidthProject * 2.09),
			(window.innerHeight / 2) * 0.63,
			false,
			'projectTitle'
		);

		textInfo.promiseDescription = this.createText(
			`${text.promiseHS.description}`,
			descriptionStyle,
			(popUpProject.width / 2) * (roomWidthProject * 2.09),
			(window.innerHeight / 2) * 0.78,
			false,
			'projectDescription'
		);

		textInfo.promiseGithub = this.createText(
			'Github',
			linkStyle,
			(popUpProject.width / 2) * (roomWidthProject * 2.09),
			(window.innerHeight / 4) * 2.7,
			true,
			'projectGithub'
		);
		textInfo.promiseGithub.on('pointertap', () =>
			this.openLink('promiseHS', 'Github')
		);

		textInfo.promiseLive = this.createText(
			'Live Site',
			linkStyle,
			(popUpProject.width / 2) * (roomWidthProject * 2.2),
			(window.innerHeight / 4) * 2.7,
			true,
			'projectLive'
		);
		textInfo.promiseLive.on('pointertap', () =>
			this.openLink('promiseHS', 'Live')
		);

		/* gobARk Project */
		textInfo.gobARk = this.createText(
			`${text.gobARk.name} -`,
			titleStyle,
			(popUpProject.width / 2) * (roomWidthProject * 2.09),
			(window.innerHeight / 2) * 0.63,
			false,
			'projectTitle'
		);

		textInfo.gobARkDescription = this.createText(
			`${text.gobARk.description}`,
			descriptionStyle,
			(popUpProject.width / 2) * (roomWidthProject * 2.09),
			(window.innerHeight / 2) * 0.78,
			false,
			'projectDescription'
		);

		textInfo.gobARkGithub = this.createText(
			'Github',
			linkStyle,
			(popUpProject.width / 2) * (roomWidthProject * 2.09),
			(window.innerHeight / 4) * 2.7,
			true,
			'projectGithub'
		);
		textInfo.gobARkGithub.on('pointertap', () =>
			this.openLink('gobARk', 'Github')
		);

		textInfo.gobARkLive = this.createText(
			'Presentation',
			linkStyle,
			(popUpProject.width / 2) * (roomWidthProject * 2.2),
			(window.innerHeight / 4) * 2.7,
			true,
			'projectLive'
		);
		new PIXI.Text('Live Site', linkStyle);
		textInfo.gobARkLive.on('pointertap', () => this.openLink('gobARk', 'Live'));

		/* Chai Noon Project */
		textInfo.chai = this.createText(
			`${text.chai.name} -`,
			titleStyle,
			(popUpProject.width / 2) * (roomWidthProject * 2.09),
			(window.innerHeight / 2) * 0.63,
			false,
			'projectTitle'
		);

		textInfo.chaiDescription = this.createText(
			`${text.chai.description}`,
			descriptionStyle,
			(popUpProject.width / 2) * (roomWidthProject * 2.09),
			(window.innerHeight / 2) * 0.78,
			false,
			'projectDescription'
		);

		textInfo.chaiGithub = this.createText(
			'Github',
			linkStyle,
			(popUpProject.width / 2) * (roomWidthProject * 2.09),
			(window.innerHeight / 4) * 2.7,
			true,
			'projectGithub'
		);
		textInfo.chaiGithub.on('pointertap', () => this.openLink('chai', 'Github'));

		textInfo.chaiLive = this.createText(
			'Live Site',
			linkStyle,
			(popUpProject.width / 2) * (roomWidthProject * 2.2),
			(window.innerHeight / 4) * 2.7,
			true,
			'projectLive'
		);
		textInfo.chaiLive.on('pointertap', () => this.openLink('chai', 'Live'));

		/* About Setion */
		/* bfa book */
		textInfo.bfa = this.createText(
			`${text.bfa.name}`,
			titleStyle,
			(window.innerWidth / 2) * (roomWidthAbout + 0.1),
			(window.innerHeight / 3) * 0.98,
			false,
			'aboutTitle'
		);
		textInfo.bfaDescription = this.createText(
			`${text.bfa.description}`,
			descriptionStyle,
			(window.innerWidth / 2) * (roomWidthAbout + 0.1),
			(window.innerHeight / 3) * 1.25,
			false,
			'aboutDescription'
		);
		textInfo.bfaGoodReads = this.createText(
			'Good Reads',
			linkStyle,
			(window.innerWidth / 2) * (roomWidthAbout + 0.1),
			(window.innerHeight / 3) * 2,
			true,
			'aboutGoodReads'
		);
		textInfo.bfaGoodReads.on('pointertap', () =>
			this.openLink('bfa', 'GoodReads')
		);

		/* Convo Book */
		textInfo.convo = this.createText(
			`${text.convo.name}`,
			titleStyle,
			(window.innerWidth / 2) * (roomWidthAbout + 0.1),
			(window.innerHeight / 3) * 0.98,
			false,
			'aboutTitle'
		);
		textInfo.convoDescription = this.createText(
			`${text.convo.description}`,
			descriptionStyle,
			(window.innerWidth / 2) * (roomWidthAbout + 0.1),
			(window.innerHeight / 3) * 1.25,
			false,
			'aboutDescription'
		);
		textInfo.convoGoodReads = this.createText(
			'Good Reads',
			linkStyle,
			(window.innerWidth / 2) * (roomWidthAbout + 0.1),
			(window.innerHeight / 3) * 2,
			true,
			'aboutGoodReads'
		);
		textInfo.convoGoodReads.on('pointertap', () =>
			this.openLink('convo', 'GoodReads')
		);

		/* Blue Ocean Book */
		textInfo.blueOcean = this.createText(
			`${text.blueOcean.name}`,
			titleStyle,
			(window.innerWidth / 2) * (roomWidthAbout + 0.1),
			(window.innerHeight / 3) * 0.98,
			false,
			'aboutTitle'
		);
		textInfo.blueOceanDescription = this.createText(
			`${text.blueOcean.description}`,
			descriptionStyle,
			(window.innerWidth / 2) * (roomWidthAbout + 0.1),
			(window.innerHeight / 3) * 1.25,
			false,
			'aboutDescription'
		);
		textInfo.blueOceanGoodReads = this.createText(
			'Good Reads',
			linkStyle,
			(window.innerWidth / 2) * (roomWidthAbout + 0.1),
			(window.innerHeight / 3) * 2,
			true,
			'aboutGoodReads'
		);
		textInfo.blueOceanGoodReads.on('pointertap', () =>
			this.openLink('blueOcean', 'GoodReads')
		);

		/* presence book */
		textInfo.presence = this.createText(
			`${text.presence.name}`,
			titleStyle,
			(window.innerWidth / 2) * (roomWidthAbout + 0.1),
			(window.innerHeight / 3) * 0.98,
			false,
			'aboutTitle'
		);
		textInfo.presenceDescription = this.createText(
			`${text.presence.description}`,
			descriptionStyle,
			(window.innerWidth / 2) * (roomWidthAbout + 0.1),
			(window.innerHeight / 3) * 1.25,
			false,
			'aboutDescription'
		);
		textInfo.presenceGoodReads = this.createText(
			'Good Reads',
			linkStyle,
			(window.innerWidth / 2) * (roomWidthAbout + 0.1),
			(window.innerHeight / 3) * 2,
			true,
			'aboutGoodReads'
		);
		textInfo.presenceGoodReads.on('pointertap', () =>
			this.openLink('presence', 'GoodReads')
		);

		textInfo.krimson = this.createText(
			`${text.plants.name}`,
			titleStyle,
			(window.innerWidth / 2) * (roomWidthAbout + 0.1),
			(window.innerHeight / 3) * 0.98,
			false,
			'aboutTitle'
		);
		textInfo.krimsonDescription = this.createText(
			`${text.plants.description}`,
			descriptionStyle,
			(window.innerWidth / 2) * (roomWidthAbout + 0.1),
			(window.innerHeight / 3) * 1.25,
			false,
			'aboutDescription'
		);

		textInfo.goat = this.createText(
			`${text.coffee.name}`,
			titleStyle,
			(window.innerWidth / 2) * (roomWidthAbout + 0.1),
			(window.innerHeight / 3) * 0.98,
			false,
			'aboutTitle'
		);
		textInfo.goatDescription = this.createText(
			`${text.coffee.description}`,
			descriptionStyle,
			(window.innerWidth / 2) * (roomWidthAbout + 0.1),
			(window.innerHeight / 3) * 1.25,
			false,
			'aboutDescription'
		);

		textInfo.stagg = this.createText(
			`${text.coffee.name}`,
			titleStyle,
			(window.innerWidth / 2) * (roomWidthAbout + 0.1),
			(window.innerHeight / 3) * 0.98,
			false,
			'aboutTitle'
		);
		textInfo.staggDescription = this.createText(
			`${text.coffee.description}`,
			descriptionStyle,
			(window.innerWidth / 2) * (roomWidthAbout + 0.1),
			(window.innerHeight / 3) * 1.25,
			false,
			'aboutDescription'
		);
	}

	render() {
		return <div></div>;
	}
}
