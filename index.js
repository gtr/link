//app setup
var io = require('socket.io-client');
//var blessed = require('blessed');

// import blessed objects from ui directory
var screen = require('./cli/screen.js');
var loading = require('./cli/loading.js');
var input = require('./cli/input.js');
var body = require('./cli/body.js');

// socket setup
var socket = io('http://localhost:4000');

// log function
const log = (text) => {
    body.pushLine(text);
    screen.render();
}

// when connected...
socket.on('connect', function() {
    console.log('made socket connection')
    screen.title = 'ultra chat';

    userJoin();
    screen.append(loading);
    screen.append(body);
    screen.append(input);
    // Handle submitting data
    input.on('submit', (text) => {
        log(text);
        input.clearValue();
    });
    screen.render();
    screen.key('enter', (ch, key) => {
        input.focus();
    });
    input.focus();
    screen.render();
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});
