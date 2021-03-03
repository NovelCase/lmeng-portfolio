import React from 'react';
import * as PixiApp from '../pixi/projectStage.js';
import * as PIXI from 'pixi.js';
require('../secrets');

let weatherWindow, sideWeatherWindow;

export default class Welcome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			weatherColor: 0,
			city: 'Manhattan',
			lat: 40.78,
			lng: 73.97,
			data: {},
			time: new Date(),
			findMe: false,
			mouseover: false,
		};
		this.calculateTemp = this.calculateTemp.bind(this);
		this.findMe = this.findMe.bind(this);
		this.chooseWeatherColor = this.chooseWeatherColor.bind(this);
		this.rgbToHex = this.rgbToHex.bind(this);
		this.componentToHex = this.componentToHex.bind(this);
	}

	async componentDidMount() {
		try {
			this.setState({ time: new Date() });
			const api_call = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?q=${this.state.city}&APPID=${process.env.API_WEATHER}`
			);
			const data = await api_call.json();
			this.setState({ data });
			this.chooseWeatherColor(
				this.calculateTemp(this.state.data.main.temp),
				this.state.data.weather[0].description,
				this.state.time
			);
		} catch (err) {
			console.log(err);
		}

		//creating window colors
		weatherWindow = new PIXI.Graphics();
		//available if needed for addt'l responsive design / scaling
		let backWindow = PixiApp.backWindowSprite;
		let backWindowWidth = PixiApp.backWindowSprite.width;
		let backWindowHeight = PixiApp.backWindowSprite.height;
		//available if needed for addt'l responsive design / scaling
		let leftWindowHeight = PixiApp.leftWindowSprite.height;
		let leftWindowSprite = PixiApp.leftWindowSprite;

		//back window
		weatherWindow
			.beginFill(this.state.weatherColor)
			.drawRect(
				//based on left window position and back window dimensions
				backWindow.position.x -
					backWindowWidth / 2 +
					40 * PixiApp.scale.windows,
				backWindow.position.y + 20 * PixiApp.scale.windows,

				backWindowWidth * 0.9,
				backWindowHeight * 0.85
			)
			.endFill();
		weatherWindow.interactive = true;
		weatherWindow.on('pointerover', () => (weatherWindow.tint = 0x007ec7));
		weatherWindow.on('pointerout', () => (weatherWindow.tint = 0xffffff));
		weatherWindow.on('pointertap', () => {
			let find = confirm('Change weather to local weather?');
			if (find) {
				alert('Updated weather!');
				this.findMe();
			}
			PixiApp.app.stage.pivot.x = 0;
		});
		PixiApp.windowWeather.addChild(weatherWindow);

		sideWeatherWindow = new PIXI.Graphics();

		// //dependent on left window position and back window dimensions
		sideWeatherWindow
			.beginFill(this.state.weatherColor)
			.drawPolygon([
				//top left corner
				leftWindowSprite.x -
					leftWindowSprite.width / 2 +
					30 * PixiApp.scale.windows,

				leftWindowSprite.position.y - leftWindowHeight * 0.45,
				//bottom left
				leftWindowSprite.x -
					leftWindowSprite.width / 2 +
					30 * PixiApp.scale.windows,
				leftWindowSprite.position.y + leftWindowHeight * 0.45,
				//bottom right
				leftWindowSprite.x +
					leftWindowSprite.width / 2 -
					30 * PixiApp.scale.windows,
				leftWindowSprite.position.y + leftWindowHeight * 0.25,
				//top right corner
				leftWindowSprite.x +
					leftWindowSprite.width / 2 -
					30 * PixiApp.scale.windows,
				leftWindowSprite.position.y - leftWindowHeight * 0.25,
			])
			.endFill();
		sideWeatherWindow.interactive = true;
		sideWeatherWindow.on(
			'pointerover',
			() => (sideWeatherWindow.tint = 0x007ec7)
		);
		sideWeatherWindow.on(
			'pointerout',
			() => (sideWeatherWindow.tint = 0xffffff)
		);
		sideWeatherWindow.on('pointertap', () => {
			let find = confirm('Change weather to local weather?');
			if (find) {
				alert('Updated weather!');
				this.findMe();
			}
			PixiApp.app.stage.pivot.x = 0;
		});
		PixiApp.windowWeather.addChild(sideWeatherWindow);
		let light = new PIXI.Graphics();
		light
			.beginFill(0xf4f5e7, 0.1)
			.drawPolygon([
				//top left corner
				leftWindowSprite.x -
					leftWindowSprite.width / 2 +
					30 * PixiApp.scale.windows,
				leftWindowSprite.position.y - leftWindowHeight * 0.45,
				//bottom left
				Math.min(
					PixiApp.appWidth / 25,
					leftWindowSprite.x -
						leftWindowSprite.width / 2 +
						30 * PixiApp.scale.windows
				),
				PixiApp.appHeight,
				//bottom right
				(PixiApp.appWidth / 3) * 2,
				PixiApp.appHeight,
				//top right corner
				leftWindowSprite.x +
					leftWindowSprite.width / 2 -
					30 * PixiApp.scale.windows,
				leftWindowSprite.position.y - leftWindowHeight * 0.25,
			])
			.endFill();
		PixiApp.windowWeather.addChild(light);
		let lightTwo = new PIXI.Graphics();
		lightTwo
			.beginFill(0xf4f5e7, 0.1)
			.drawPolygon([
				//top left corner
				backWindow.position.x -
					backWindowWidth / 2 +
					40 * PixiApp.scale.windows,
				backWindow.position.y,
				//bottom left
				PixiApp.appWidth / 15,
				PixiApp.appHeight,
				//bottom right
				Math.max(
					(PixiApp.appWidth / 4) * 3,
					backWindow.position.x + backWindowWidth
				),
				PixiApp.appHeight,
				//top right corner
				backWindow.position.x +
					backWindowWidth / 2 -
					40 * PixiApp.scale.windows,
				backWindow.position.y,
				// connect
			])
			.endFill();
		PixiApp.windowWeather.addChild(lightTwo);
		// const findMeDiv = new PIXI.Graphics();
		// let findMeSprite = new PIXI.Graphics();
		// findMeSprite.beginFill(this.state.weathercolor)
		// findMeSprite.position.x = backWindow.position.x + backWindow.width / 1.3;
		// findMeSprite.position.y = backWindow.position.y;
		// findMeSprite.anchor.set(0.5);
		// findMeSprite.interactive = true;
		// findMeSprite.buttonMode = true;
		// findMeSprite.on('pointerover', () => (findMeSprite.tint = 0x007ec7));
		// findMeSprite.on('pointerout', () => (findMeSprite.tint = 0xffffff));
		// findMeSprite.on('pointertap', () => {
		// 	let find = confirm('Change weather to local weather?');
		// 	if (find) {
		// 		alert('Updated weather!');
		// 		this.findMe();
		// 	}
		// 	PixiApp.app.stage.pivot.x = 0;
		// });

		// PixiApp.findMeDiv.addChild(findMeSprite);
	}

	async findMe() {
		let newLat, newLong;
		try {
			navigator.geolocation.getCurrentPosition(async (position) => {
				newLat = position.coords.latitude;
				newLong = position.coords.longitude;
				const api_call = await fetch(
					`https://api.openweathermap.org/data/2.5/weather?lat=${newLat}&lon=${newLong}&APPID=${process.env.API_WEATHER}`
				);
				const data = await api_call.json();
				this.setState({ data });
				this.chooseWeatherColor(
					this.calculateTemp(this.state.data.main.temp),
					this.state.data.weather[0].description,
					this.state.time
				);
			});

			//should probably include something if the geolocation is not successful
		} catch (err) {
			console.log(err);
		}
	}

	//just to change color of windows
	componentDidUpdate(prevState) {
		//creating window colors
		if (prevState.weatherColor !== this.state.weatherColor) {
			weatherWindow = new PIXI.Graphics();
			//available if needed for addt'l responsive design / scaling
			let backWindow = PixiApp.backWindowSprite;
			let backWindowWidth = PixiApp.backWindowSprite.width;
			let backWindowHeight = PixiApp.backWindowSprite.height;
			//available if needed for addt'l responsive design / scaling
			let leftWindowHeight = PixiApp.leftWindowSprite.height;
			let backWindowX = PixiApp.backWindowSprite.position.x;
			let leftWindowSprite = PixiApp.leftWindowSprite;

			//back window
			weatherWindow
				.beginFill(this.state.weatherColor)
				.drawRect(
					//based on left window position and back window dimensions
					backWindowX - backWindowWidth / 2,
					backWindow.position.y + 20 * PixiApp.scale.windows,

					backWindowWidth,
					backWindowHeight * 0.9
				)
				.endFill();

			PixiApp.windowWeather.addChild(weatherWindow);
			PixiApp.windowWeather.removeChild(sideWeatherWindow);

			//dependent on left window position and back window dimensions
			sideWeatherWindow = new PIXI.Graphics();
			sideWeatherWindow
				.beginFill(this.state.weatherColor)
				.drawPolygon([
					//top left corner
					leftWindowSprite.x -
						leftWindowSprite.width / 2 +
						30 * PixiApp.scale.windows,

					leftWindowSprite.position.y - leftWindowHeight * 0.45,
					//bottom left
					leftWindowSprite.x -
						leftWindowSprite.width / 2 +
						30 * PixiApp.scale.windows,
					leftWindowSprite.position.y + leftWindowHeight * 0.45,
					//bottom right
					leftWindowSprite.x +
						leftWindowSprite.width / 2 -
						30 * PixiApp.scale.windows,
					leftWindowSprite.position.y + leftWindowHeight * 0.25,
					//top right corner
					leftWindowSprite.x +
						leftWindowSprite.width / 2 -
						30 * PixiApp.scale.windows,
					leftWindowSprite.position.y - leftWindowHeight * 0.25,
				])
				.endFill();
			PixiApp.windowWeather.addChild(sideWeatherWindow);
		}
	}

	//temp conversion from kelvin
	calculateTemp(degreesK, displayUnits) {
		let degrees;
		if (displayUnits === 'C') {
			degrees = Math.floor(degreesK - 273);
		} else {
			degrees = Math.floor(((degreesK - 273) * 9) / 5 + 32);
		}
		return degrees;
	}

	//convert an indivudal r b g component to hex
	componentToHex(c) {
		const hex = c.toString(16);
		return hex.length == 1 ? '0' + hex : hex;
	}

	//convert rbg string to hex
	rgbToHex(r, g, b) {
		const hexVal =
			'#' +
			this.componentToHex(r) +
			this.componentToHex(g) +
			this.componentToHex(b);
		const num = parseInt(hexVal.substring(1), 16);
		return num;
	}

	//choose weather color on time and weather
	chooseWeatherColor(temp, clouds, time) {
		let r, g, b;

		// deal with clouds
		let cloudy = false;
		let broken = false;
		let few = false;
		if (clouds.includes('cloud') || clouds.includes('Cloud')) {
			cloudy = true;
		}
		if (clouds.includes('broken')) {
			broken = true;
		}
		if (clouds.includes('few')) {
			few = true;
		}

		//get current time of day
		let dayTime = time.getHours() === 0 ? 24 : time.getHours();

		//deal with light
		if (6 <= dayTime && dayTime <= 16) {
			//blue should be higher when lighter
			b = Math.floor((1 - dayTime / 36) * 255);
		} else {
			b = Math.floor((1 - dayTime / 48) * 60);
		}

		//make red dependent on temp to show heat
		r = Math.floor(((temp / 100) * 255) / 9);

		//if there are clouds, rgb should be very close together for grey effect
		if (cloudy && broken) {
			g = Math.floor(b * 0.65);
			r = Math.floor(g * 0.55);
		} else if (cloudy && few) {
			g = Math.floor(b * 0.5);
			r = Math.floor(b * 0.3);
		} else if (cloudy) {
			g = Math.floor(b * 0.8);
			r = Math.floor(g * 0.75);
		} else {
			//green should generally be half of blue for a blue sky
			g = Math.floor(b * 0.75);
		}

		//translate rbg elements into hex
		r = this.componentToHex(r);
		g = this.componentToHex(g);
		b = this.componentToHex(b);
		//translate rgb string to hex
		let rgbHex = this.rgbToHex(r, g, b);
		//set weather on state
		this.setState({ weatherColor: rgbHex });
	}

	render() {
		return <div></div>;
	}
}
