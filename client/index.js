import React from 'react';
import ReactDOM from 'react-dom';
import '../public/style.css';
// import * as PixiApp from '../pixi/app.js';
import Project from './ProjectView';
import Welcome from './WelcomeView';
import Contact from './ContactView';
import Menu from './Menu';
import * as PixiApp from '../pixi/projectStage.js';
require('babel-core/register');
require('babel-polyfill');

ReactDOM.render(
	<div>
		<Menu />
		<Project />
		<Welcome />
		<Contact />
	</div>,
	document.getElementById('app')
);
