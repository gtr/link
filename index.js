//app setup
var io = require('socket.io-client');
var blessed = require('blessed');

// import blessed objects from ui directory
var screen = require('./cli/screen.js');
var input = require('./cli/input.js');
var body = require('./cli/body.js');

// socket setup
var socket = io('http://localhost:4000');

// log function
const log = (text) => {
    //text = '{center}' + text + '{/center}';
    body.pushLine(text);
    screen.render();
}

// create a enterHandle box to identify client
var enterHandle = blessed.box({
    top: 'center',
    left: 'center',
    width: '50%',
    height: '20%',
    content: '{bold}Enter handle{/bold}!',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'cyan',
        border: {
            fg: '#f0f0f0'
        },
        hover: {
            bg: 'green'
        }
    }
});

// when connected...
socket.on('connect', function() {
    screen.title = 'ultra chat';
    // emit that new user has connected
    socket.emit('newUser', {
        caption: 'new user'
    })
    screen.append(enterHandle);
    screen.append(body);
    screen.append(input);
    // Handle submitting data
    input.on('submit', (text) => {
        //log(text);
        input.clearValue();
        socket.emit('chat', {
            //handle: handle,
            message: text
        })
    });
    screen.render();
    screen.key('enter', (ch, key) => {
        input.focus();
    });
    input.focus();
    screen.render();
    screen.render();
});

// on chat message...
socket.on('chat', function(data){
    log(data.message);
});

// on new user...
socket.on('newUser', function(data) {
    log(data.caption);
})


// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});
