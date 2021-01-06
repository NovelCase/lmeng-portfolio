import React from 'react';
import * as PixiApp from '../pixi/projectStage.js';
import * as PIXI from 'pixi.js';
require('../secrets');

let weatherWindow, sideWeatherWindow;

export default class Welcome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//SF data for testing purposes
			// lat: 37.77,
			// lng: -122.42,
			//NY data
			// lat: 40.75,
			// lng: -73.98,
			//florida data
			weatherColor: 0,
			//for testing- change to Manhattan
			city: 'Miami',
			lat: 27.66,
			lng: -81.51,
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
		let width = PixiApp.appWidth;
		let height = PixiApp.appHeight;
		let backWindowWidth = PixiApp.backWindowWidth;
		let backWindowHeight = PixiApp.backWindowWidth;
		//available if needed for addt'l responsive design / scaling
		let leftWindowHeight = PixiApp.leftWindowHeight;
		let backWindowX = PixiApp.backWindowSprite.position.x;
		let backWindowY = PixiApp.backWindowSprite.position.y;
		let leftWindowSprite = PixiApp.leftWindowSprite;

		//back window
		weatherWindow
			.beginFill(this.state.weatherColor)
			.drawRect(
				//based on left window position and back window dimensions
				leftWindowSprite.position.x + backWindowWidth / 7,
				leftWindowSprite.position.y - backWindowHeight * 0.39,
				backWindowWidth * 0.95,
				backWindowHeight * 0.45
			)
			.endFill();

		PixiApp.windowWeather.addChild(weatherWindow);

		sideWeatherWindow = new PIXI.Graphics();

		//dependent on left window position and back window dimensions
		sideWeatherWindow
			.beginFill(this.state.weatherColor)
			.drawPolygon([
				//top left corner
				leftWindowSprite.position.x - backWindowWidth / 6,
				leftWindowSprite.position.y - backWindowHeight * 0.1,
				//bottom left
				leftWindowSprite.position.x - backWindowWidth / 6,
				leftWindowSprite.position.y + backWindowHeight * 0.35,
				//bottom right
				leftWindowSprite.position.x + backWindowWidth / 12,
				leftWindowSprite.position.y + backWindowHeight * 0.07,
				//top right corner
				leftWindowSprite.position.x + backWindowWidth / 12,
				leftWindowSprite.position.y - backWindowHeight * 0.37,
			])
			.endFill();
		PixiApp.windowWeather.addChild(sideWeatherWindow);

		let backWindowSprite = PixiApp.backWindowSprite;
		const findMeDiv = PIXI.Texture.from('/siteAssets/findMeDiv.png');
		let findMeSprite = new PIXI.Sprite(findMeDiv);
		findMeSprite.position.x =
			backWindowSprite.position.x + backWindowSprite.width / 1.3;
		findMeSprite.position.y = backWindowSprite.position.y;
		findMeSprite.anchor.set(0.5);
		findMeSprite.interactive = true;
		findMeSprite.buttonMode = true;
		findMeSprite.on('mouseover', () => (findMeSprite.tint = 0x007ec7));
		findMeSprite.on('mouseout', () => (findMeSprite.tint = 0xffffff));
		findMeSprite.on('click', () => {
			this.findMe();
			PixiApp.app.stage.pivot.x = 0;
		});
		findMeSprite.on('tap', () => {
			this.findMe();
			PixiApp.app.stage.pivot.x = 0;
		});

		PixiApp.findMeDiv.addChild(findMeSprite);
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
			let width = PixiApp.appWidth;
			let height = PixiApp.appHeight;
			let backWindowWidth = PixiApp.backWindowWidth;
			let backWindowHeight = PixiApp.backWindowWidth;
			//available if needed for addt'l responsive design / scaling
			let leftWindowHeight = PixiApp.leftWindowHeight;
			let backWindowX = PixiApp.backWindowSprite.position.x;
			let backWindowY = PixiApp.backWindowSprite.position.y;
			let leftWindowSprite = PixiApp.leftWindowSprite;
			let backWindowSprite = PixiApp.backWindowSprite;

			//back window
			weatherWindow
				.beginFill(this.state.weatherColor)
				.drawRect(
					//based on left window position and back window dimensions
					leftWindowSprite.position.x + backWindowWidth / 7,
					leftWindowSprite.position.y - backWindowHeight * 0.39,
					backWindowWidth * 0.95,
					backWindowHeight * 0.45
				)
				.endFill();

			PixiApp.windowWeather.addChild(weatherWindow);

			sideWeatherWindow = new PIXI.Graphics();

			//dependent on left window position and back window dimensions
			sideWeatherWindow
				.beginFill(this.state.weatherColor)
				.drawPolygon([
					//top left corner
					leftWindowSprite.position.x - backWindowWidth / 6,
					leftWindowSprite.position.y - backWindowHeight * 0.1,
					//bottom left
					leftWindowSprite.position.x - backWindowWidth / 6,
					leftWindowSprite.position.y + backWindowHeight * 0.35,
					//bottom right
					leftWindowSprite.position.x + backWindowWidth / 12,
					leftWindowSprite.position.y + backWindowHeight * 0.07,
					//top right corner
					leftWindowSprite.position.x + backWindowWidth / 12,
					leftWindowSprite.position.y - backWindowHeight * 0.37,
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
		let light = false;
		// deal with clouds
		let cloudy = false;
		if (clouds.includes('cloud') || clouds.includes('Cloud')) {
			cloudy = true;
		}
		//get current time of day
		let dayTime = time.getHours() === 0 ? 24 : time.getHours();
		if (6 < dayTime < 16) {
			light = true;
		} else {
			light = false;
		}
		r = Math.floor(((temp / 100) * 255) / 7);
		//blue should be higher when lighter
		if (light) {
			b = Math.floor((1 - dayTime / 24) * 255);
		} else {
			b = Math.floor((1 - dayTime / 48) * 255);
		}
		//if there are clouds, rgh should be very close together for grey effect
		if (cloudy) {
			g = Math.floor(b * 0.95);
			r = Math.floor(g * 0.95);
		} else {
			//green should generally be half of blue for a blue sky
			g = Math.floor(b / 2);
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
