// ========================================================================
// Server init
// ========================================================================

const fs = require('fs-extra');
const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const sanitize = require('sanitize-html');

// Load settings
let stats;
try {
	stats = fs.lstatSync('settings.json');
} catch (e) {
	if (e.code === "ENOENT") {
		try {
			fs.copySync('settings.example.json', 'settings.json');
			console.log("Created new settings file.");
		} catch (e) {
			console.log(e);
			throw "Could not create new settings file.";
		}
	} else {
		console.log(e);
		throw "Could not read 'settings.json'.";
	}
}
const settings = require("./settings.json");

// Init express
const app = express();

// Serve static files (adjust path as needed)
if (settings.express.serveStatic) {
	app.use(express.static(path.join(__dirname, '../src/www')));
}

// Create server
const server = http.createServer(app);

// Init Socket.IO
const io = socketIO(server);
exports.io = io;

// Init winston logging
const Log = require('./log.js');
Log.init();
const log = Log.log;

// Load ban list
const Ban = require('./ban.js');
Ban.init();

// Start listening
const port = process.env.PORT || settings.port || 3000;
server.listen(port, function () {
	console.log(
		" Welcome to BonziWORLD!\n",
		"Time to meme!\n",
		"----------------------\n",
		"Server listening at port " + port
	);
});

// Serve fallback static (optional, for public assets)
app.use(express.static(path.join(__dirname, 'public')));

// Other modules
const Utils = require("./utils.js");
const Meat = require("./meat.js");
Meat.beat();

const Console = require('./console.js');
Console.listen();
