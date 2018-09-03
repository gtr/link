//app setup
var io = require('socket.io-client');
var blessed = require('blessed');
var inNameScreen = true;

// import blessed objects from cli directory
var screen = require('./cli/screen.js');
var input = require('./cli/input.js');
var body = require('./cli/body.js');

// color setup
colorArray = ['#ffe792', '#f92672', '#66d9ef', 
    '#a6e22e', '#e07272', '#859900', '#dd1C1a', 
    '#fd971f', '#92ffbd', '#daa0ff', '#e0d847', 
    '#f9b56b', '#9bf7a8'
]

// socket setup
var socket = io('http://localhost:4000');

// log function
const logMessage = function (handleName, msg) {
    color = '#f92672'
    intermediate = handleName.charCodeAt(0) + handleName.charCodeAt(1) + handleName.length;
    color = colorArray[(intermediate * 17) % colorArray.length]

    var text = '{bold}{' + color + '-fg}' + handleName + '{/bold}{/' + color + '-fg}' + ': ' + msg
    body.pushLine(text)
    screen.render();
}

const logNotification = function (text) {
    var text = '{center}{yellow-fg}' + text + '{/center}{/yellow-fg}'
    body.pushLine(text)
    screen.render();
}

// create a enterHandle form to identify client
var enterHandle = blessed.form({
    parent: screen,
    width: '90%',
    height: 10,
    top: 2,
    left: 'center',
    keys: true,
    content: 'Enter handle (at least two charcters long)',
    vi: true
});

// create handle textbox
var handle = blessed.textbox({
    parent: enterHandle,
    name: 'handle',
    top: 4,
    left: 0,
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

// when connected for the first time
socket.on('connect', function() {
    screen.title = 'ultra chat';
    screen.append(enterHandle);
    screen.render();
});

// handle events
enter.on('press', function () {
    enterHandle.submit();
});

// handle submit
enterHandle.on('submit', function (data) {
    handle = data.handle;
    id = socket.io.engine.id
    socket.emit('submitHandle', {
        handle: handle,
        id: id
    });
});

// when user already exists
socket.on('failed', function() {
    enterHandle.content = 'That handle already exists. Please choose another handle.'
    screen.render();
})

// when the server authorizes the client to enter the chat
socket.on('enterChat', function() {
    id = socket.io.engine.id
    inNameScreen = false;
    screen.append(body);
    screen.append(input);

    // emit load data
    socket.emit('loadMessages', {
        id: id
    });

    // handle submitting data
    input.on('submit', function(text) {
        input.clearValue();
        socket.emit('chat', {
            handle: handle,
            message: text
        })
        input.focus();
    });

    screen.render();
    screen.key('enter', function(ch, key) {
        input.focus();
    });

    input.focus();
});

// on chat message
socket.on('chat', function(data){
    if (inNameScreen) {
        // should not log message
    } else {
        //totalMessage = data.handle + ": " + data.message
        logMessage(data.handle, data.message);
    };
});

// on new user
socket.on('newUser', function(data) {
    logNotification(data.caption);
});

// quit on esc, q, or ctrl-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});
