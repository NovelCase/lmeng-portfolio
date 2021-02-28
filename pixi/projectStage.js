const { Sprite } = require('pixi.js');
const PIXI = require('pixi.js');
const Project = require('../client/ProjectView');
var _ = require('lodash');

window.WebFontConfig = {
	google: {
		families: ['Montserrat'],
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

app.renderer.backgroundColor = 0x9cc4cb;
let pixiDiv = document.getElementById('pixi');
pixiDiv.appendChild(app.view);

export const appWidth = app.renderer.view.width;
export const appHeight = app.renderer.view.height;

let left = keyboard('ArrowLeft'),
	up = keyboard('ArrowUp'),
	right = keyboard('ArrowRight'),
	down = keyboard('ArrowDown'),
	space = keyboard(' ' || 'Spacebar');

//Left arrow key `press` method
left.press = () => {
	if (app.stage.pivot.x >= appWidth) {
		app.stage.pivot.x =
			Math.floor(app.stage.pivot.x / appWidth) * appWidth - appWidth;
	} else app.stage.pivot.x = 0;
};
//Up
up.press = () => {};
//Right
right.press = () => {
	if (app.stage.pivot.x <= appWidth * 2) {
		app.stage.pivot.x =
			Math.floor(app.stage.pivot.x / appWidth) * appWidth + appWidth;
	} else app.stage.pivot.x = 3 * appWidth;
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
	};
	function onWindowResize() {
		app.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	//Attach event listeners
	const downListener = key.downHandler.bind(key);
	const upListener = key.upHandler.bind(key);

	window.addEventListener('keydown', downListener, false);
	window.addEventListener('keyup', upListener, false);
	window.addEventListener('wheel', _.throttle(onwheel, 0), false);

	// Detach event listeners
	key.unsubscribe = () => {
		window.removeEventListener('keydown', downListener);
		window.removeEventListener('keyup', upListener);
		window.removeEventListener('wheel', _.throttle(onwheel, 0), false);
	};

	return key;
}

//welcome view helper code

//welcome view scaling with set height and width for windows
let backWindowWidth = 600;
let backWindowHeight = 300;
let leftWindowHeight = 480;
export let welcomeScale = {
	windows: 0.65,
	snake1: 0.8,
	snake2: 0.8,
	monstera: 0.8,
	maranta: 0.5,
	card: 0.85,
	findMe: 0.65,
};
if (appWidth < 400) {
	welcomeScale.windows = 0.48;
	welcomeScale.card = 0.45;
	welcomeScale.snake1 = 0.48;
	welcomeScale.snake2 = 0.48;
	welcomeScale.monstera = 0.48;
	welcomeScale.maranta = 0.3;
	backWindowWidth = 270;
	backWindowHeight = 210;
	leftWindowHeight = 330;
} else if (appWidth < 500) {
	welcomeScale.windows = 0.455;
	welcomeScale.findMeDiv = 0.455;
	welcomeScale.card = 0.595;
	welcomeScale.snake1 = 0.56;
	welcomeScale.snake2 = 0.56;
	welcomeScale.monstera = 0.56;
	welcomeScale.maranta = 0.35;
	backWindowWidth = 270;
	backWindowHeight = 210;
	leftWindowHeight = 330;
}
/****** Background *******/

let ceiling = new PIXI.Graphics();
ceiling
	.beginFill(0xf9eee0)
	.drawRect(0, 0, appWidth * 4, appHeight / 2)
	.endFill();
if (appHeight > 560) app.stage.addChild(ceiling);

export let trim = new PIXI.Graphics();
trim
	.beginFill(0xf1cc9c)
	.drawPolygon([
		//top left corner
		appWidth / 8,
		appHeight / 12,
		//bottom left
		0,
		(appHeight * 1) / 12 -
			Math.max(appWidth / 7.25, appWidth / 7 - 225 * welcomeScale.windows),
		//capture weird triangle
		0,
		(appHeight * 3.5) / 24 -
			Math.max(appWidth / 7.25, appWidth / 7 - 225 * welcomeScale.windows),

		appWidth / 8,
		(appHeight / 24) * 3, //bottom right
		appWidth * 4,
		appHeight / 3,
		//top right corner
		appWidth * 4,
		appHeight / 12,
	])
	.endFill();
if (appHeight > 560) app.stage.addChild(trim);
let walls = new PIXI.Graphics();
walls
	.beginFill(0x9cc4cb)
	.drawPolygon([
		//top left corner
		appWidth / 8,
		(appHeight / 24) * 3,

		//bottom left
		0,
		(appHeight * 3.5) / 24 -
			Math.max(appWidth / 7.25, appWidth / 7 - 225 * welcomeScale.windows),
		//extra piece

		0,
		appHeight / 1.75 + appHeight / 24,
		//bottom right
		appWidth * 4,
		appHeight / 1.75 + appHeight / 24,
		//top right corner
		appWidth * 4,
		(appHeight / 24) * 3,
	])
	.endFill();
app.stage.addChild(walls);

let floor = new PIXI.Graphics();
floor
	.beginFill(0xa68655)
	.drawPolygon([
		//top left corner
		appWidth / 8,
		appHeight - appHeight * 0.3,
		//bottom left
		0,
		Math.min(
			appHeight,
			0.7 * appHeight +
				Math.max(appWidth / 7.66, appWidth / 8 - 100 * welcomeScale.windows)
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
app.stage.addChild(floor);

/****** Welcome room *******/

//for welcome component weather

export let windowWeather = new PIXI.Container();
app.stage.addChild(windowWeather);

//function to create welcome sprites
function createWelcomeSprite(x, y, texture, type, anchor = null) {
	const sprite = new Sprite(texture);
	app.stage.addChild(sprite);
	if (anchor === null) sprite.anchor.set(0.5);
	else sprite.anchor.set(0.5, anchor);
	sprite.position.x = x;
	sprite.position.y = y;
	sprite.scale.set(welcomeScale[`${type}`]);
	return sprite;
}

//textures
const leftWindow = PIXI.Texture.from('/siteAssets/tiltedWindow1.png');
const backWindow = PIXI.Texture.from('/siteAssets/window.png');
const wideWindow = PIXI.Texture.from('/siteAssets/longwindow.png');
const helloCard = PIXI.Texture.from('/siteAssets/hello-sticker.png');
const snake1 = PIXI.Texture.from('/siteAssets/snakeplant-shadow.png');
const snake2 = PIXI.Texture.from('/siteAssets/snakeplant2-shadow.png');
const maranta = PIXI.Texture.from('/siteAssets/marantatest.png');
const monstera = PIXI.Texture.from('/siteAssets/monsteraLT.png');

//sprites
export let leftWindowSprite = createWelcomeSprite(
	appWidth / 8 - 150 * welcomeScale.windows,
	Math.max(
		appHeight / 8 + 420 * 0.5 * welcomeScale.windows + appHeight / 12,
		420 * 0.5 * welcomeScale.windows + appHeight / 12
	),
	leftWindow,
	'windows'
);

export let backWindowSprite;
if (appWidth < 700) {
	backWindowSprite = createWelcomeSprite(
		appWidth / 8 + 320 * welcomeScale.windows,
		Math.max(158 * welcomeScale.windows + appHeight / 12, 0),
		backWindow,
		'windows',
		0
	);
} else {
	backWindowSprite = createWelcomeSprite(
		appWidth / 8 + 450 * welcomeScale.windows,
		Math.max(0, 158 * welcomeScale.windows + appHeight / 12),
		wideWindow,
		'windows',
		0
	);
}

//left
let snakeTwoSprite = createWelcomeSprite(
	appWidth / 6 + 50 * welcomeScale.snake2,
	appHeight - appHeight * 0.3 - 200 * welcomeScale.snake2,
	snake2,
	'snake2'
);

//right
let snakeOneSprite = createWelcomeSprite(
	appWidth / 6 + 50 * welcomeScale.snake2 + 80 * welcomeScale.snake1,
	appHeight - appHeight * 0.3 - 100 * welcomeScale.snake1,
	snake1,
	'snake1'
);

let marantaSprite = createWelcomeSprite(
	Math.min(
		appWidth - 400 * welcomeScale.maranta,
		appWidth / 8 + 1000 * welcomeScale.windows
	),
	Math.max(0, appHeight / 12 + 270 * welcomeScale.maranta),
	maranta,
	'maranta'
);

let monsteraShadowSprite = createWelcomeSprite(
	120 * welcomeScale.monstera,
	appHeight - 200 * welcomeScale.monstera,
	monstera,
	'monstera'
);

let helloCardSprite = createWelcomeSprite(
	appWidth / 1.4,
	appHeight / 1.4,
	helloCard,
	'card'
);

//Project view helper code

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
	guestbook: 0.8,
	decor: 0.9,
	keys: 0.5,
};
if (appWidth < 400) {
	scale.project = scale.plant = 0.3;
	scale.desk = 0.55;
	scale.shelf = scale.board = scale.guestbook = 0.5;
	scale.book = 0.7;
	scale.decor = 0.6;
	scale.table = 0.8;
	scale.radio = 0.9;
	scale.keys = scale.coffee = 0.4;
} else if (appWidth < 500) {
	scale.project = 0.35;
	scale.plant = 0.34;
	scale.desk = 0.75;
	scale.guestbook = 0.7;
	scale.book = 0.8;
	scale.shelf = scale.decor = 0.6;
	scale.table = scale.radio = 0.9;
	scale.keys = scale.coffee = 0.4;
} else if (appWidth > 900) {
	scale.shelf = 1;
	scale.desk = 1;
}

//function to create project sprites
export function createSprite(x, y, texture, type) {
	const sprite = new Sprite(texture);
	app.stage.addChild(sprite);
	sprite.anchor.set(0.5);
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
		].includes(type)
	) {
		sprite.scale.set(scale[`${type}`]);
		sprite.interactive = true;
		sprite.buttonMode = true;
		sprite.on('pointerover', () => {
			sprite.rotation = 0.05;
			sprite.scale.set(scale[`${type}`] + 0.03);
		});
		sprite.on('pointerout', () => {
			sprite.rotation = 0;
			sprite.scale.set(scale[`${type}`]);
		});
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

let desk = createSprite(
	(appWidth / 2) * 3,
	(appHeight / 4) * 2.4,
	deskTexture,
	'desk'
);

export let chai = createSprite(
	Math.min((appWidth / 2) * 2.6, (appWidth / 2) * 3 - 400 * scale.project),
	appHeight / 3,
	chaiTexture,
	'project'
);
chai.on('pointerover', () => (chai.tint = 0xfffff9));
chai.on('pointerout', () => (chai.tint = 0xffffff));
chai.on('pointertap', () => {
	let projects = [promiseHS, gobARk];
	Project.onClick('project', 'chai', projects);
	projects.forEach((project) => (project.interactive = false));
	app.stage.pivot.x = appWidth;
});
chai.on('tap', () => {
	let projects = [promiseHS, gobARk];
	Project.onClick('project', 'chai', projects);
	projects.forEach((project) => (project.interactive = false));
	app.stage.pivot.x = appWidth;
});

export let gobARk = createSprite(
	(appWidth / 4) * 6,
	appHeight / 4,
	barkTexture,
	'project'
);
gobARk.on('pointerover', () => (gobARk.tint = 0xfffff9));
gobARk.on('pointerout', () => (gobARk.tint = 0xffffff));
gobARk.on('pointertap', () => {
	let projects = [promiseHS, chai];
	Project.onClick('project', 'gobARk', projects);
	projects.forEach((project) => (project.interactive = false));
	app.stage.pivot.x = appWidth;
});
gobARk.on('tap', () => {
	let projects = [promiseHS, chai];
	Project.onClick('project', 'gobARk', projects);
	projects.forEach((project) => (project.interactive = false));
	app.stage.pivot.x = appWidth;
});

export let promiseHS = createSprite(
	Math.max((appWidth / 2) * 3.4, (appWidth / 2) * 3 + 500 * scale.project),
	appHeight / 3,
	promiseTexture,
	'project'
);

promiseHS.on('pointerover', () => (promiseHS.tint = 0xfffff9));
promiseHS.on('pointerout', () => (promiseHS.tint = 0xffffff));
promiseHS.on('pointertap', () => {
	let projects = [gobARk, chai];
	Project.onClick('project', 'promise', projects);
	projects.forEach((project) => (project.interactive = false));
	app.stage.pivot.x = appWidth;
});
promiseHS.on('tap', () => {
	let projects = [gobARk, chai];
	Project.onClick('project', 'promise', projects);
	projects.forEach((project) => (project.interactive = false));
	app.stage.pivot.x = appWidth;
});

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
export let bfa = createSprite(
	(appWidth / 4) * 9.3 + scale.book / 2,
	appHeight / 3,
	bfaText,
	'book'
);
bfa.on('pointerover', () => (bfa.tint = 0xaf0000));
bfa.on('pointerout', () => (bfa.tint = 0xffffff));
bfa.on('pointertap', () => {
	let items = [convo, blueOcean, krimson, goat, stagg];
	Project.onClick('about', 'bfa', items);
	items.forEach((item) => (item.interactive = false));
	app.stage.pivot.x = 2 * appWidth;
});

let convoText = PIXI.Texture.from('/siteAssets/convowfear.png');
export let convo = createSprite(
	(appWidth / 4) * 9.35 + scale.book / 2,
	appHeight / 3 - 10 * scale.book,
	convoText,
	'book'
);
convo.on('pointerover', () => (convo.tint = 0xfffff9));
convo.on('pointerout', () => (convo.tint = 0xffffff));
convo.on('pointertap', () => {
	let items = [bfa, blueOcean, presence, krimson, goat, stagg];
	Project.onClick('about', 'convo', items);
	items.forEach((item) => (item.interactive = false));
	app.stage.pivot.x = 2 * appWidth;
});

let blueText = PIXI.Texture.from('/siteAssets/blue-book.png');
export let blueOcean = createSprite(
	(appWidth / 4) * 9.35 + scale.book / 2 + 5,
	appHeight / 3 - 25 * scale.book,
	blueText,
	'book'
);
blueOcean.on('pointerover', () => (blueOcean.tint = 0xfffff9));
blueOcean.on('pointerout', () => (blueOcean.tint = 0xffffff));
blueOcean.on('pointertap', () => {
	let items = [bfa, convo, presence, krimson, goat, stagg];
	Project.onClick('about', 'blueOcean', items);
	items.forEach((item) => (item.interactive = false));
	app.stage.pivot.x = 2 * appWidth;
});

/* Right Shelf */
let presText = PIXI.Texture.from('/siteAssets/vertbook.png');
export let presence = createSprite(
	(appWidth / 4) * 10.8 - scale.book / 2 - 90 * scale.shelf,
	(appHeight / 5) * 2 - 40 * scale.book,
	presText,
	'book'
);
presence.on('pointerover', () => (presence.tint = 0xfffff9));
presence.on('pointerout', () => (presence.tint = 0xffffff));
presence.on('pointertap', () => {
	let items = [bfa, convo, blueOcean, krimson, goat, stagg];
	Project.onClick('about', 'presence', items);
	items.forEach((item) => (item.interactive = false));
	app.stage.pivot.x = 2 * appWidth;
});

let krimTexture = PIXI.Texture.from('/siteAssets/krimson-queen.png');
export let krimson = createSprite(
	(appWidth / 4) * 10.9 - scale.book / 2,
	(appHeight / 5) * 2 - 100 * scale.plant,
	krimTexture,
	'plant'
);
krimson.on('pointerover', () => (krimson.tint = 0xfffff9));
krimson.on('pointerout', () => (krimson.tint = 0xffffff));
krimson.on('pointertap', () => {
	let items = [bfa, convo, blueOcean, presence, goat, stagg];
	Project.onClick('about', 'krimson', items);
	items.forEach((item) => (item.interactive = false));
	app.stage.pivot.x = 2 * appWidth;
});

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
	'coffee'
);
goat.on('pointerover', () => (goat.tint = 0xfffff9));
goat.on('pointerout', () => (goat.tint = 0xffffff));
goat.on('pointertap', () => {
	let items = [bfa, convo, blueOcean, presence, krimson, stagg];
	Project.onClick('about', 'goat', items);
	items.forEach((item) => (item.interactive = false));
	app.stage.pivot.x = 2 * appWidth;
});

let felText = PIXI.Texture.from('/siteAssets/stagg.png');
let stagg = createSprite(
	(appWidth / 2) * 5 + scale.coffee * 150,
	(appHeight / 4) * 2.6 - scale.coffee * 200,
	felText,
	'coffee'
);
stagg.on('pointerover', () => (stagg.tint = 0xfffff9));
stagg.on('pointerout', () => (stagg.tint = 0xffffff));
stagg.on('pointertap', () => {
	let items = [bfa, convo, blueOcean, presence, krimson, goat];
	Project.onClick('about', 'stagg', items);
	items.forEach((item) => (item.interactive = false));
	app.stage.pivot.x = 2 * appWidth;
});

/**********    Contact Me    *************/

/* socials links */
let socialsText = PIXI.Texture.from('/siteAssets/socials-board-nk.png');
let chalkboard = createSprite(
	(appWidth / 2) * 7,
	appHeight / 3,
	socialsText,
	'board'
);
let stayInTouch = new PIXI.Text('Stay in Touch!', {
	fill: ['#ffffff', '#f4f5e7'],
});
stayInTouch.position.x = (appWidth / 2) * 7 - 165 * scale.board;
stayInTouch.y = appHeight / 3 - 50 * scale.board;
stayInTouch.angle = -15;
app.stage.addChild(stayInTouch);
let gitText = PIXI.Texture.from('/siteAssets/github-key.png');
let github = createSprite(
	(appWidth / 2) * 7 - 165 * scale.board,
	appHeight / 3 + 110 * scale.board - 40 * scale.keys,
	gitText,
	'keys'
);
github.on('pointerover', () => (github.tint = 0xfffff9));
github.on('pointerout', () => (github.tint = 0xffffff));
github.on('pointertap', () => {
	window.open('https://github.com/leslie-meng', '_blank');
	app.stage.pivot.x = 3 * appWidth;
});

let codeText = PIXI.Texture.from('/siteAssets/codepen-key.png');
let codepen = createSprite(
	(appWidth / 2) * 7 + 165 * scale.board,
	appHeight / 3 + 110 * scale.board - 40 * scale.keys,
	codeText,
	'keys'
);
codepen.on('pointerover', () => (codepen.tint = 0xfffff9));
codepen.on('pointerout', () => (codepen.tint = 0xffffff));
codepen.on('pointertap', () => {
	window.open('https://codepen.io/leslie-meng', '_blank');
	app.stage.pivot.x = 3 * appWidth;
});

let linkText = PIXI.Texture.from('/siteAssets/linkedin-key.png');
let linkedin = createSprite(
	(appWidth / 2) * 7,
	appHeight / 3 + 110 * scale.board - 40 * scale.keys,
	linkText,
	'keys'
);
linkedin.on('pointerover', () => (linkedin.tint = 0xfffff9));
linkedin.on('pointerout', () => (linkedin.tint = 0xffffff));
linkedin.on('pointertap', () => {
	window.open('https://www.linkedin.com/in/leslie-meng/', '_blank');
	app.stage.pivot.x = 3 * appWidth;
});

/* radio and plant */
export let secondMonstera = createSprite(
	(appWidth / 2) * 7.5,
	(appHeight / 4) * 2.4,
	monstera,
	'decor'
);

/* table with guest book */

let tableText = PIXI.Texture.from('/siteAssets/tableLT.png');
let table = createSprite(
	(appWidth / 2) * 6.7,
	(appHeight / 4) * 3,
	tableText,
	'table'
);
let gbookText = PIXI.Texture.from('/siteAssets/guestbookColor.png');
let guestbook = createSprite(
	(appWidth / 2) * 6.75,
	(appHeight / 4) * 3 - 180 * scale.table + 70 * scale.guestbook,
	gbookText,
	'guestbook'
);
guestbook.on('pointerover', () => (guestbook.tint = 0xfffff9));
guestbook.on('pointerout', () => (guestbook.tint = 0xffffff));
guestbook.on('pointertap', () => {
	window.location.href =
		'mailto:m.leslie.meng@gmail.com?subject=Just visited your website!';
	app.stage.pivot.x = 3 * appWidth;
});
app.ticker.add((delta) => {});
/* Pop Ups */
export let popUps = new PIXI.Container();
app.stage.addChild(popUps);

export let text = new PIXI.Container();
app.stage.addChild(text);

export let spotifyPixi = new PIXI.Container();
app.stage.addChild(spotifyPixi);

export let findMeDiv = new PIXI.Container();
app.stage.addChild(findMeDiv);
