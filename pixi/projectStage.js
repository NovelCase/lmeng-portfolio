const { Sprite } = require('pixi.js');
const PIXI = require('pixi.js');
var _ = require('lodash');
const { data } = require('../data');
const { Scrollbox } = require('pixi-scrollbox');
export let lock = {
	scroll: false,
};
/** canvas configuration setup */
window.WebFontConfig = {
	google: {
		families: ['Montserrat', 'sans-serif'],
	},
};
(function () {
	const wf = document.createElement('script');
	wf.src = `${
		document.location.protocol === 'https:' ? 'https' : 'http'
	}://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
	wf.type = 'text/javascript';
	wf.async = 'true';
	const s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(wf, s);
})();

export const app = new PIXI.Application({
	transparent: false,
	resizeTo: window,
});

app.renderer.backgroundColor = 0xa68655;
let pixiDiv = document.getElementById('pixi');
pixiDiv.appendChild(app.view);

export const appWidth = window.innerWidth;
export const appHeight = window.innerHeight;

// all keyboard and event-listeners

let left = keyboard('ArrowLeft'),
	right = keyboard('ArrowRight');

//Left arrow key `press` method
left.press = () => {
	if (!lock[scroll]) {
		if (app.stage.pivot.x >= appWidth) {
			app.stage.pivot.x =
				Math.floor(app.stage.pivot.x / appWidth) * appWidth - appWidth;
		} else app.stage.pivot.x = 0;
		helpButton.position.x = app.stage.pivot.x + appWidth - 35;
	}
};

//Right
right.press = () => {
	if (!lock[scroll]) {
		if (app.stage.pivot.x <= appWidth * 2) {
			app.stage.pivot.x =
				Math.floor(app.stage.pivot.x / appWidth) * appWidth + appWidth;
		} else app.stage.pivot.x = 3 * appWidth;
		helpButton.position.x = app.stage.pivot.x + appWidth - 35;
	}
};

function keyboard(value) {
	let key = {};
	key.value = value;
	key.isDown = false;
	key.isUp = true;
	key.press = undefined;
	key.release = undefined;
	//The `downHandler`
	key.downHandler = (event) => {
		if (event.key === key.value) {
			if (key.isUp && key.press) key.press();
			key.isDown = true;
			key.isUp = false;
			event.preventDefault();
		}
	};

	//The `upHandler`
	key.upHandler = (event) => {
		if (event.key === key.value) {
			if (key.isDown && key.release) key.release();
			key.isDown = false;
			key.isUp = true;
			event.preventDefault();
		}
	};

	onwheel = (event) => {
		if (!lock[scroll]) {
			if (
				app.stage.pivot.x < 0 ||
				app.stage.pivot.x + (event.deltaY * 1.2 || event.deltaX * 1.2) < 0
			) {
				app.stage.pivot.x = 0;
			} else if (
				app.stage.pivot.x > appWidth * 3 ||
				app.stage.pivot.x + (event.deltaY * 1.2 || event.deltaX * 1.2) >
					appWidth * 3
			) {
				app.stage.pivot.x = appWidth * 3;
			} else app.stage.pivot.x += event.deltaY * 1.2 || event.deltaX * 1.2;
			helpButton.position.x = app.stage.pivot.x + appWidth - 35;
		}
	};
	ontouchmove = (event) => {
		event.preventDefault();
		if (!lock[scroll]) {
			if (
				app.stage.pivot.x < 0 ||
				app.stage.pivot.x + (window.pageXOffset || window.pageYOffset) < 0
			) {
				app.stage.pivot.x = 0;
			} else if (
				app.stage.pivot.x > appWidth * 3 ||
				app.stage.pivot.x + (window.pageXOffset || window.pageYOffset) >
					appWidth * 3
			) {
				app.stage.pivot.x = appWidth * 3;
			} else app.stage.pivot.x += window.pageXOffset || window.pageYOffset;
			helpButton.position.x = app.stage.pivot.x + appWidth - 35;
		}
	};
	/* resize - web resposive */
	window.addEventListener('resize', resize);
	function resize() {
		popUpProject.removeChildren();
		localStorage.setItem(
			'position',
			Math.round(app.stage.pivot.x / window.innerWidth)
		);
		window.location.reload();
	}

	//Attach event listeners
	const downListener = key.downHandler.bind(key);
	const upListener = key.upHandler.bind(key);

	window.addEventListener('keydown', downListener, false);
	window.addEventListener('keyup', upListener, false);
	window.addEventListener('wheel', _.throttle(onwheel, 0), false);
	window.addEventListener('touchmove', ontouchmove, false);

	// Detach event listeners
	key.unsubscribe = () => {
		window.removeEventListener('keydown', downListener);
		window.removeEventListener('keyup', upListener);
		window.removeEventListener('wheel', _.throttle(onwheel, 0), false);
		window.removeEventListener('touchmove', ontouchmove, false);
	};

	return key;
}

//welcome view helper code

//welcome view scaling with set height and width for windows
//project view scaling

export let scale = {
	project: 0.5,
	desk: 0.8,
	book: 1,
	shelf: 0.8,
	coffee: 0.5,
	table: 1.1,
	radio: 1.3,
	plant: 0.5,
	board: 0.7,
	palms: 0.7,
	guestbook: 0.8,
	decor: 0.9,
	keys: 0.5,
	windows: 0.65,
	snake: 0.8,
	monstera: 0.8,
	maranta: 0.5,
	card: 0.85,
	findMe: 0.5,
	stack: 1,
	logo: 0.15,
};
if (appHeight < 400) {
	scale.project = 0.2;
	scale.plant = 0.15;
	scale.desk = 0.45;
	scale.shelf = scale.decor = scale.table = scale.stack = 0.5;
	scale.guestbook = 0.35;
	scale.board = scale.card = scale.snake = scale.monstera = 0.4;
	scale.book = 0.6;
	scale.radio = 0.8;
	scale.keys = scale.windows = scale.coffee = 0.3;
	scale.maranta = scale.palms = 0.25;
	scale.logo = scale.stack / 6;
} else if (appHeight < 500) {
	scale.project = scale.maranta = 0.25;
	scale.plant = 0.2;
	scale.desk = 0.45;
	scale.shelf = scale.board = scale.guestbook = scale.decor = 0.5;
	scale.book = scale.stack = 0.6;
	scale.table = 0.7;
	scale.radio = 0.8;
	scale.keys = scale.coffee = scale.palms = 0.3;
	scale.windows = scale.card = scale.snake = scale.monstera = 0.4;
	scale.logo = scale.stack / 6;
} else if (appWidth < 400) {
	scale.project = scale.plant = scale.maranta = scale.coffee = 0.3;
	scale.desk = 0.55;
	scale.shelf = scale.board = scale.guestbook = 0.5;
	scale.book = scale.stack = 0.7;
	scale.decor = 0.6;
	scale.table = 0.8;
	scale.radio = 0.9;
	scale.windows = scale.snake = scale.monstera = 0.48;
	scale.card = 0.45;
	scale.keys = 0.4;
	scale.logo = scale.stack / 6;
} else if (appWidth < 500) {
	scale.project = scale.maranta = 0.35;
	scale.card = 0.5;
	scale.plant = 0.34;
	scale.desk = 0.75;
	scale.guestbook = 0.7;
	scale.book = scale.stack = 0.8;
	scale.shelf = scale.decor = 0.6;
	scale.table = scale.radio = 0.9;
	scale.keys = scale.coffee = 0.4;
	scale.windows = findMeDiv = 0.455;
	scale.windows = scale.snake = scale.monstera = 0.56;
	scale.logo = scale.stack / 6;
} else if (appWidth > 900) {
	scale.shelf = 1;
	scale.desk = 1;
}

/*******Containers***** */

const megaContainer = new PIXI.Container();
app.stage.addChild(megaContainer);
const bgContainer = new PIXI.Container();
megaContainer.addChild(bgContainer);

/****** Background *******/
let backX;
let backY;
if (appHeight < 400) {
	backX = appWidth / 12;
	backY = appHeight / 24;
} else {
	backX = appWidth / 8;
	backY = appHeight / 16;
}
let ceiling = new PIXI.Graphics();
ceiling
	.beginFill(0xf9eee0)
	.drawRect(0, 0, appWidth * 4, appHeight / 2)
	.endFill();
bgContainer.addChild(ceiling);

export let trim = new PIXI.Graphics();
trim
	.beginFill(0xf1cc9c)
	.drawPolygon([
		//top left corner
		backX,
		appHeight / 12,
		//bottom left
		0,
		(appHeight * 1) / 12 -
			Math.max(appWidth / 7.25, appWidth / 7 - 225 * scale.windows),
		//capture weird triangle
		0,
		(appHeight * 3.5) / 24 -
			Math.max(appWidth / 7.25, appWidth / 7 - 225 * scale.windows),

		backX,
		(appHeight / 24) * 3, //bottom right
		appWidth * 4,
		appHeight / 3,
		//top right corner
		appWidth * 4,
		appHeight / 12,
	])
	.endFill();
bgContainer.addChild(trim);
let walls = new PIXI.Graphics();
walls
	.beginFill(0x9cc4cb)
	.drawPolygon([
		//top left corner
		backX,
		(appHeight / 24) * 3,

		//bottom left
		0,
		(appHeight * 3.5) / 24 -
			Math.max(appWidth / 7.25, appWidth / 7 - 225 * scale.windows),
		//extra piece

		0,
		Math.min(
			appHeight,
			0.7 * appHeight +
				Math.max(appWidth / 7.66, appWidth / 8 - 100 * scale.windows)
		),
		backX,
		appHeight - appHeight * 0.3,
		//bottom right
		appWidth * 4,
		appHeight - appHeight * 0.3,
		//top right corner
		appWidth * 4,
		(appHeight / 24) * 3,
	])
	.endFill();
bgContainer.addChild(walls);

let floor = new PIXI.Graphics();
floor
	.beginFill(0xa68655)
	.drawPolygon([
		//top left corner
		backX,
		appHeight - appHeight * 0.3,
		//bottom left
		0,
		Math.min(
			appHeight,
			0.7 * appHeight +
				Math.max(appWidth / 7.66, appWidth / 8 - 100 * scale.windows)
		),
		0,
		appHeight,
		//bottom right
		appWidth * 4,
		appHeight,
		//top right corner
		appWidth * 4,
		appHeight - appHeight * 0.3,
	])
	.endFill();
bgContainer.addChild(floor);
export let shadow = new PIXI.Graphics();
shadow
	.beginFill(0x000000, 0.7)
	.drawRect(0, 0, appWidth * 4, appHeight * 4)
	.endFill();
shadow.visible = false;

if (localStorage.getItem('position')) {
	app.stage.pivot.x = localStorage.getItem('position') * window.innerWidth;
	localStorage.removeItem('position');
}
// popup logic

let scrollbox;
export let popUpProject = new PIXI.Container();

let titleStyle = {
	fontFamily: ['Montserrat', 'sans-serif'],
	fontSize: 35,
	fontWeight: '600',
	wordWrap: true,
	lineHeight: 50,
	wordWrapWidth:
		window.outerHeight < 500
			? window.outerWidth * 0.8
			: Math.max(window.outerWidth / 3, 300),
};
let descriptionStyle = {
	fontFamily: ['Montserrat', 'sans-serif'],
	fontSize: 23,
	fontWeight: '400',
	lineHeight: 50,
	wordWrap: true,
	wordWrapWidth:
		window.outerHeight < 500
			? window.outerWidth * 0.8
			: Math.max(window.outerWidth / 3, 300),
};
let linkStyle = {
	fontFamily: ['Montserrat', 'sans-serif'],
	fontSize: 23,
	fill: '#007EC7',
};
const redXTexture = PIXI.Texture.from('/siteAssets/x-mark.png');
const closeButton = new PIXI.Sprite(redXTexture);

function createPopUpRect(title, num) {
	/* Styling */

	popUpProject.removeChildren();
	let x =
		(num === null ? app.stage.pivot.x : window.outerWidth * num) +
		app.renderer.view.width / 4;
	let y = window.outerHeight / 4;
	let width = window.outerWidth / 2;
	let height = window.outerHeight / 2;

	if (window.outerWidth < 500 || window.outerHeight < 500) {
		x = num === null ? app.stage.pivot.x : window.outerWidth * num;
		y = window.outerHeight / 8;
		width = window.outerWidth;
		height = window.outerHeight * 0.75;
	}

	let rect = new PIXI.Graphics();
	rect.beginFill(0xf4f5e7).drawRoundedRect(x, y, width, height, 20).endFill();
	rect.visible = true;

	closeButton.anchor.set(1, 0);
	closeButton.position.x = x + width - 10;
	closeButton.position.y = y + 10;
	closeButton.visible = true;
	closeButton.interactive = true;
	closeButton.buttonMode = true;
	closeButton.on('pointertap', function () {
		if (num !== null) app.stage.pivot.x = window.outerWidth * num;
		helpButton.position.x = app.stage.pivot.x + app.renderer.view.width - 35;
		popUpProject.removeChildren();
		popUpProject.visible = false;
		lock[scroll] = false;
		shadow.visible = false;
	});
	popUpProject.addChild(rect);
	popUpProject.addChild(closeButton);
	let popTitle = createText(
		data[title].name,
		titleStyle,
		x + width / 10,
		y + 30,
		false,
		'title'
	);
	scrollbox = popUpProject.addChild(
		new Scrollbox({
			boxWidth: (rect.width / 11) * 10 - 20,
			boxHeight: Math.max(rect.height - 150, 90),
		})
	);
	let projectDetails = scrollbox.content.addChild(new PIXI.Graphics());
	projectDetails
		.beginFill(0xf4f5e7, 0.25)
		.drawRect(0, 0, (rect.width / 11) * 9, rect.height - 150)
		.endFill();
	scrollbox.position.set(
		x + rect.width / 10,
		Math.min(popTitle.position.y + popTitle.height + 10, y + 130)
	);
	if (title === 'techStack' || title === 'navDesk') {
		if (
			(window.outerWidth < 600 || window.outerHeight < 600) &&
			title === 'navDesk'
		)
			title = 'navMobile';
		let spriteBox = new PIXI.Sprite(
			PIXI.Texture.from(`${data[title].description}`)
		);
		spriteBox.height *= ((rect.width / 11) * 9) / spriteBox.height;
		spriteBox.width = (rect.width / 11) * 9;

		scrollbox.content.addChild(spriteBox);
	} else {
		let popDesc = createText(
			data[title].description,
			descriptionStyle,
			0,
			0,
			false,
			'description'
		);
		scrollbox.update();
		if (data[title].linkOne) {
			let popLinkOne = createText(
				data[title].linkOne,
				linkStyle,
				x + rect.width / 6,
				y + rect.height - 50,
				true,
				'projectGithub'
			);
			popLinkOne.on('pointertap', () => openLink(title, 'One'));
		}
		if (data[title].linkTwo) {
			let popLinkTwo = createText(
				data[title].linkTwo,
				linkStyle,
				x + (rect.width / 6) * 5,
				y + rect.height - 50,
				true,
				'projectLive'
			);
			popLinkTwo.on('pointertap', () => openLink(title, 'Two'));
		}
	}
	popUpProject.visible = true;
	return popUpProject;
}

function openLink(projectName, linkType) {
	linkType = 'link' + linkType + 'Url';
	window.open(`${data[projectName][linkType]}`);
}

function createText(words, style, x, y, interactive, type) {
	const text = new PIXI.Text(words, style);
	if (type === 'projectLive') text.anchor.set(1, 0);
	text.visible = true;
	text.position.x = x;
	text.position.y = y;
	if (interactive) {
		text.interactive = true;
		text.buttonMode = true;
	}
	if (type !== 'description') popUpProject.addChild(text);
	else scrollbox.content.addChild(text);
	return text;
}
/****** Welcome room *******/

//for welcome component weather

export let windowWeather = new PIXI.Container();
megaContainer.addChild(windowWeather);

//textures
const leftWindow = PIXI.Texture.from('/siteAssets/tiltedWindow1.png');
const backWindow = PIXI.Texture.from('/siteAssets/window.png');
const wideWindow = PIXI.Texture.from('/siteAssets/longwindow.png');
const helloCard = PIXI.Texture.from('/siteAssets/hello-sticker.png');
const snake1 = PIXI.Texture.from('/siteAssets/snakeplant-shadow.png');
const snake2 = PIXI.Texture.from('/siteAssets/snakeplant2-shadow.png');
const maranta = PIXI.Texture.from('/siteAssets/marantatest.png');
const monstera = PIXI.Texture.from('/siteAssets/monsteraLT.png');

const hoya = PIXI.Texture.from('/siteAssets/hoya.png');
const palm = PIXI.Texture.from('/siteAssets/palm.png');
const areca = PIXI.Texture.from('/siteAssets/areca.png');
//sprites

let leftWindowSprite = createSprite(
	backX - 150 * scale.windows,
	appHeight / 8 + 420 * 0.5 * scale.windows + backY,
	leftWindow,
	'windows'
);

let backWindowSprite;

if (appWidth < 700) {
	backWindowSprite = createSprite(
		backX + 320 * scale.windows,
		(appHeight / 24) * 3 + backY,
		backWindow,
		'windows',
		0
	);
} else {
	backWindowSprite = createSprite(
		backX + 450 * scale.windows,
		(appHeight / 24) * 3 + backY,
		wideWindow,
		'windows',
		0
	);
}

export { leftWindowSprite, backWindowSprite };
//left
let snakeTwoSprite = createSprite(
	appWidth / 6 + 50 * scale.snake,
	appHeight - appHeight * 0.3 - 200 * scale.snake,
	snake2,
	'snake'
);

//right
let snakeOneSprite = createSprite(
	appWidth / 6 + 50 * scale.snake + 80 * scale.snake,
	appHeight - appHeight * 0.3 - 100 * scale.snake,
	snake1,
	'snake'
);

let marantaSprite = createSprite(
	Math.min(appWidth - 400 * scale.maranta, appWidth / 8 + 1000 * scale.windows),
	Math.max(0, appHeight / 12 + 270 * scale.maranta),
	maranta,
	'maranta'
);

let monsteraShadowSprite = createSprite(
	120 * scale.monstera,
	appHeight - 240 * scale.monstera,
	monstera,
	'monstera'
);

let helloCardSprite = createSprite(
	appWidth / 1.4,
	appHeight / 1.4,
	helloCard,
	'card',
	0.5,
	'helloCard',
	0
);
if (appWidth > 800) {
	let hoyaSprite = createSprite(appWidth / 1, backY / 2, hoya, 'maranta', 0);
	let palmSprite = createSprite(
		appWidth * 1.9 + 50 * scale.palms + 150 * scale.palms,
		appHeight - appHeight * 0.3 - 220 * scale.palms,
		palm,
		'palms'
	);
	let arecaSprite = createSprite(
		appWidth * 2.97 + 50 * scale.palms,
		appHeight - appHeight * 0.3 - 200 * scale.palms,
		areca,
		'palms'
	);
}

//Project view helper code

//function to create project sprites
export function createSprite(
	x,
	y,
	texture,
	type,
	anchor = 0.5,
	name,
	num,
	special = null
) {
	const sprite = new Sprite(texture);
	megaContainer.addChild(sprite);
	sprite.anchor.set(0.5, anchor);
	sprite.position.x = x;
	sprite.position.y = y;
	if (type === 'desk') {
		sprite.scale.set(scale.desk);
	} else if (
		[
			'coffee',
			'book',
			'project',
			'plant',
			'radio',
			'keys',
			'guestbook',
			'card',
			'stack',
			'logo',
		].includes(type)
	) {
		sprite.scale.set(scale[`${type}`]);
		sprite.interactive = true;
		sprite.buttonMode = true;
		sprite.on('pointerover', function () {
			sprite.rotation += 0.08;
			sprite.scale.set(scale[`${type}`] + 0.05);
			if (special) this.texture = special;
		});
		sprite.on('pointerout', function () {
			sprite.rotation -= 0.08;
			sprite.scale.set(scale[`${type}`]);
			if (special) this.texture = texture;
		});
		sprite.on('resize', () => {
			sprite.scale.set(scale[`${type}`]);
		});
		if (type !== 'radio') {
			if (typeof name === 'function') {
				sprite.on('pointertap', name);
			} else
				sprite.on('pointertap', function () {
					if (num !== null) {
						app.stage.pivot.x = window.outerWidth * num;
						helpButton.position.x =
							app.stage.pivot.x + app.renderer.view.width - 35;
					}
					lock[scroll] = true;
					shadow.visible = true;
					createPopUpRect(name, num);
				});
		}
	} else {
		sprite.scale.set(scale[`${type}`]);
	}
	return sprite;
}

/****** Project room *******/

const deskTexture = PIXI.Texture.from('/siteAssets/desk-color-schemeLT.png');
const chaiTexture = PIXI.Texture.from('/siteAssets/chaiNoon.png');
const barkTexture = PIXI.Texture.from('/siteAssets/gobARk.png');
const promiseTexture = PIXI.Texture.from('siteAssets/promiseHSLT.png');
const stackTexture = PIXI.Texture.from('/siteAssets/stackbox.png');
const stackRoll = PIXI.Texture.from('/siteAssets/stackboxroll.png');
let resumeTexture = PIXI.Texture.from('/siteAssets/resume.png');
let resumeRollTexture = PIXI.Texture.from('/siteAssets/resumeroll.png');
let novelTexture = PIXI.Texture.from('/siteAssets/novelCaseSticker.png');

let chai = createSprite(
	Math.min((appWidth / 2) * 2.6, (appWidth / 2) * 3 - 400 * scale.project),
	backY + (appHeight * 3) / 23,
	chaiTexture,
	'project',
	0,
	'chai',
	1
);

let gobARk = createSprite(
	(appWidth / 4) * 6,
	backY + (appHeight * 3) / 24,
	barkTexture,
	'project',
	0,
	'gobARk',
	1
);

let promiseHS = createSprite(
	Math.max((appWidth / 2) * 3.4, (appWidth / 2) * 3 + 500 * scale.project),
	appHeight / 3,
	promiseTexture,
	'project',
	0.5,
	'promiseHS',
	1
);

let desk = createSprite(
	(appWidth / 2) * 3,
	(appHeight / 4) * 2.4,
	deskTexture,
	'desk'
);
let stack = createSprite(
	(appWidth / 2) * 3 - 180 * scale.desk,
	(appHeight / 4) * 2.4,
	stackTexture,
	'stack',
	1,
	'techStack',
	1,
	stackRoll
);
let helpTexture = PIXI.Texture.from('/siteAssets/helpbutton.png');
let helpRollTexture = PIXI.Texture.from('/siteAssets/helpbuttonroll.png');

export let helpButton = createSprite(
	app.stage.pivot.x + appWidth - 35,
	appHeight - 25,
	helpTexture,
	'stack',
	1,
	'navDesk',
	null,
	helpRollTexture
);

const resFunc = () => {
	let openRes = confirm('Open resume in new window?');
	if (openRes) window.open('https://leslie-meng.github.io/Resume/', '_blank');
	app.stage.pivot.x = appWidth;
};
let resume = createSprite(
	(appWidth / 2) * 3 - 180 * scale.desk,
	(appHeight / 4) * 2.4 + 9 * scale.desk,
	resumeTexture,
	'stack',
	0,
	resFunc,
	1,
	resumeRollTexture
);

let novelCase = createSprite(
	(appWidth / 2) * 3 + 170 * scale.desk,
	(appHeight / 4) * 2.4 + 95 * scale.desk,
	novelTexture,
	'logo',
	0,
	'novelCase',
	1
);
novelCase.rotation = -0.5;
/****** About Me room *******/

let shelfTexture = PIXI.Texture.from('/siteAssets/shelfLT.png');
let leftShelf = createSprite(
	(appWidth / 4) * 9.3 + scale.book / 2,
	appHeight / 3 + 10,
	shelfTexture,
	'shelf'
);
let rightShelf = createSprite(
	(appWidth / 4) * 10.8 - scale.book / 2,
	(appHeight / 5) * 2,
	shelfTexture,
	'shelf'
);

/* Things on shelves */

/* Left Shelf */
let bfaText = PIXI.Texture.from('/siteAssets/bfa-book.png');
let bfa = createSprite(
	(appWidth / 4) * 9.3 + scale.book / 2,
	appHeight / 3,
	bfaText,
	'book',
	0.5,
	'bfa',
	2
);

let whitebook = PIXI.Texture.from('/siteAssets/whitebook.png');
let webtoons = createSprite(
	(appWidth / 4) * 9.35 + scale.book / 2,
	appHeight / 3 - 10 * scale.book,
	whitebook,
	'book',
	0.5,
	'webtoons',
	2
);

let blueText = PIXI.Texture.from('/siteAssets/blue-book.png');
let blueOcean = createSprite(
	(appWidth / 4) * 9.35 + scale.book / 2 + 5,
	appHeight / 3 - 25 * scale.book,
	blueText,
	'book',
	0.5,
	'blueOcean',
	2
);

/* Right Shelf */
let vertbook = PIXI.Texture.from('/siteAssets/vertbook.png');
let webnovels = createSprite(
	(appWidth / 4) * 10.8 - scale.book / 2 - 90 * scale.shelf,
	(appHeight / 5) * 2 - 40 * scale.book,
	vertbook,
	'book',
	0.5,
	'webnovel',
	2
);

let krimTexture = PIXI.Texture.from('/siteAssets/krimson-queen.png');
let krimson = createSprite(
	(appWidth / 4) * 10.9 - scale.book / 2,
	(appHeight / 5) * 2 - 100 * scale.plant,
	krimTexture,
	'plant',
	0.5,
	'plants',
	2
);

let sideTab = PIXI.Texture.from('/siteAssets/sideboardLT.png');
let sideboard = createSprite(
	(appWidth / 2) * 5,
	(appHeight / 4) * 2.4,
	sideTab,
	'desk'
);

let goatText = PIXI.Texture.from('/siteAssets/goat.png');
let goat = createSprite(
	(appWidth / 2) * 5 - scale.coffee * 140,
	(appHeight / 4) * 2.6 - scale.coffee * 260,
	goatText,
	'coffee',
	0.5,
	'coffee',
	2
);

let felText = PIXI.Texture.from('/siteAssets/stagg.png');
let stagg = createSprite(
	(appWidth / 2) * 5 + scale.coffee * 150,
	(appHeight / 4) * 2.6 - scale.coffee * 200,
	felText,
	'coffee',
	0.5,
	'tea',
	2
);

/**********    Contact Me    *************/

/* socials links */
let socialsText = PIXI.Texture.from('/siteAssets/socials-board.png');
let chalkboard = createSprite(
	(appWidth / 2) * 6.6,
	backY + (appHeight * 3) / 24,
	socialsText,
	'board',
	0
);

let gitText = PIXI.Texture.from('/siteAssets/github-key.png');
let github = createSprite(
	(appWidth / 2) * 6.6 - 165 * scale.board,
	backY + (appHeight * 3) / 24 + 200 * scale.board,
	gitText,
	'keys',
	0
);
github.on('pointertap', () => {
	window.open('https://github.com/leslie-meng', '_blank');
	app.stage.pivot.x = 3 * appWidth;
});

let codeText = PIXI.Texture.from('/siteAssets/codepen-key.png');
let codepen = createSprite(
	(appWidth / 2) * 6.6 + 165 * scale.board,
	backY + (appHeight * 3) / 24 + 200 * scale.board,
	codeText,
	'keys',
	0
);
codepen.on('pointertap', () => {
	window.open('https://codepen.io/leslie-meng', '_blank');
	app.stage.pivot.x = 3 * appWidth;
});

let linkText = PIXI.Texture.from('/siteAssets/linkedin-key.png');
let linkedin = createSprite(
	(appWidth / 2) * 6.6,
	backY + (appHeight * 3) / 24 + 200 * scale.board,
	linkText,
	'keys',
	0
);
linkedin.on('pointertap', () => {
	window.open('https://www.linkedin.com/in/leslie-meng/', '_blank');
	app.stage.pivot.x = 3 * appWidth;
});

/* radio and plant */
export let secondMonstera = createSprite(
	(appWidth / 2) * 7.3,
	(appHeight / 4) * 2.4,
	monstera,
	'decor'
);

/* table with guest book */

let tableText = PIXI.Texture.from('/siteAssets/tableLT.png');
let table = createSprite(
	(appWidth / 2) * 6.2,
	(appHeight / 4) * 3,
	tableText,
	'table'
);
let gbookText = PIXI.Texture.from('/siteAssets/guestbookColor.png');
let guestbook = createSprite(
	(appWidth / 2) * 6.2 - 60 * scale.table,
	(appHeight / 4) * 3 - 200 * scale.table + 70 * scale.guestbook,
	gbookText,
	'guestbook'
);
guestbook.on('pointertap', () => {
	window.location.href =
		'mailto:m.leslie.meng@gmail.com?subject=Just visited your website!';
	app.stage.pivot.x = 3 * appWidth;
});
app.ticker.add((delta) => {});

export let text = new PIXI.Container();
megaContainer.addChild(text);

export let spotifyPixi = new PIXI.Container();
megaContainer.addChild(spotifyPixi);

export let findMeDiv = new PIXI.Container();
megaContainer.addChild(findMeDiv);
megaContainer.addChild(shadow);
megaContainer.addChild(popUpProject);
