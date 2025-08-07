// ========================================================================
// Server Init
// ========================================================================

const fs = require('fs-extra');
const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const sanitize = require('sanitize-html');

// Load settings
try {
	if (!fs.existsSync(path.join(__dirname, 'settings.json'))) {
		fs.copySync(
			path.join(__dirname, 'settings.example.json'),
			path.join(__dirname, 'settings.json')
		);
		console.log("Created new settings file.");
	}
} catch (e) {
	console.error(e);
	throw "Could not create new settings file.";
}

// Load settings into memory
const settings = require(path.join(__dirname, 'settings.json'));

// Init express
const app = express();

// Serve static files if enabled in settings
if (settings.express?.serveStatic) {
	app.use(express.static(path.join(__dirname, '../src/www')));
}

// Serve fallback public directory
app.use(express.static(path.join(__dirname, 'public')));

// Create HTTP server
const server = http.createServer(app);

// Init Socket.IO
const io = socketIO(server);
exports.io = io;

// Init logger
const Log = require(path.join(__dirname, 'log.js'));
Log.init();
const log = Log.log;

// Load ban list
const Ban = require(path.join(__dirname, 'ban.js'));
Ban.init();

if (settings.express?.serveStatic) {
	app.use(express.static(path.join(__dirname, '../src/www')));
}

// Start listening
const port = process.env.PORT || settings.port || 3000;
server.listen(port, () => {
	console.log(
		" Welcome to BonziWORLD!\n",
		"Time to meme!\n",
		"----------------------\n",
		"Server listening at port " + port
	);
});

// Load main logic and utilities
const Utils = require(path.join(__dirname, 'utils.js'));
const Meat = require(path.join(__dirname, 'meat.js'));
Meat.beat();

// Admin console commands
const Console = require(path.join(__dirname, 'console.js'));
Console.listen();
