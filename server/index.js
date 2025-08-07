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
	if (!fs.existsSync('settings.json')) {
		fs.copySync('settings.example.json', 'settings.json');
		console.log("Created new settings file.");
	}
} catch (e) {
	console.error(e);
	throw "Could not create new settings file.";
}
const settings = require('./settings.json');

// Init express
const app = express();

// Serve static files
if (settings.express?.serveStatic) {
	app.use(express.static(path.join(__dirname, 'src/www')));
}

// Optional fallback static dir
app.use(express.static(path.join(__dirname, 'public')));

// Create HTTP server
const server = http.createServer(app);

// Init Socket.IO
const io = socketIO(server);
exports.io = io;

// Init logger
const Log = require('./log.js');
Log.init();
const log = Log.log;

// Load ban list
const Ban = require('./ban.js');
Ban.init();

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

// Main logic
const Utils = require('./utils.js');
const Meat = require('./meat.js');
Meat.beat();

// Admin console
const Console = require('./console.js');
Console.listen();
