'use strict';
const webpack = require('webpack');

const { resolve } = require('path');

module.exports = (env) => {
	return {
		entry: ['babel-polyfill', './client/index.js'],
		output: {
			path: __dirname,
			filename: './public/bundle.js',
		},
		mode: 'development',
		context: __dirname,
		devtool: 'source-map',
		resolve: {
			extensions: ['.js', '.jsx'],
		},
		module: {
			rules: [
				{
					test: /jsx?$/,
					loader: 'babel-loader',
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader'],
				},
				{
					test: /\.(png|jpe?g|gif)$/i,
					use: [
						{
							loader: 'file-loader',
						},
						{
							loader: 'url-loader',
							options: {
								limit: 8192,
							},
						},
					],
				},
			],
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.API_WEATHER': JSON.stringify(
					'e85282415ad04fe926b501b1b9888316'
				),
			}),
		],
	};
};
