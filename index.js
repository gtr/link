//app setup
var io = require('socket.io-client');
var blessed = require('blessed');

// import blessed objects from ui directory
var screen = require('./cli/screen.js');
var loading = require('./cli/loading.js');

// socket setup
var socket = io('http://localhost:4000');


socket.on('connect', function() {
    console.log('made socket connection')
    screen.title = 'ultra chat';
    screen.append(loading);
    screen.render();
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});
