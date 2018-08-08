//app setup
var io = require('socket.io-client');
var blessed = require('blessed');

// import blessed objects from cli directory
var screen = require('./cli/screen.js');
var input = require('./cli/input.js');
var body = require('./cli/body.js');

// socket setup
var socket = io('http://localhost:4000');

// log function
const log = (text) => {
    body.pushLine(text);
    screen.render();
}

// create a enterHandle form to identify client
var enterHandle = blessed.form({
    parent: screen,
    width: '90%',
    left: 'center',
    keys: true,
    vi: true
});

var label1 = blessed.text({
    parent: screen,
    top: 0,
    left: 'center',
    content: 'FIRST NAME:',
    style: {
        fg: 'white'
    }
});

// create handle textbox
var handle = blessed.textbox({
    parent: enterHandle,
    name: 'handle',
    top: 4,
    left: 5,
    height: 3,
    inputOnFocus: true,
    content: 'first',
    border: {
        type: 'line'
    },
    focus: {
        fg: 'blue'
    }
});

// create submit button
var enter = blessed.button({
    parent: enterHandle,
    name: 'submit',
    content: 'Enter',
    top: 10,
    left: 5,
    shrink: true,
    padding: {
        top: 1,
        right: 2,
        bottom: 1,
        left: 2
    },
    style: {
        bold: true,
        fg: 'white',
        bg: 'green',
        focus: {
            inverse: true
        }
    }
});

// display notification from server
var notification = blessed.message({
    parent: screen,
    top: 40,
    left: 5,
    style: {
        italic: true,
        fg: 'green'
    }
});

// handle events
enter.on('press', function () {
    enterHandle.submit();
});

enterHandle.on('submit', function (data) {
    handle = data.handle;
    socket.emit('submitHandle', {
        handle: handle
    });
    socket.emit('enterChat', handle);
});

// when connected...
socket.on('connect', function() {
    screen.title = 'ultra chat';
    screen.append(label1);
    screen.append(enterHandle);
    screen.render();
});

socket.on('enterChat', function() {
    screen.append(body);
    screen.append(input);
    // Handle submitting data
    input.on('submit', function(text) {
        //log(text);
        input.clearValue();
        socket.emit('chat', {
            handle: handle,
            message: text
        })
    });
    screen.render();
    screen.key('enter', function(ch, key) {
        input.focus();
    });
    input.focus();
});

// on chat message...
socket.on('chat', function(data){
    log(data.handle, data.message);
});

// on new user...
socket.on('newUser', function(data) {
    log(data.caption);
});


// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});
