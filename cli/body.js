var blessed = require('blessed');

var body = blessed.box({
    top: 0,
    left: 0,
    height: '100%-1',
    width: '100%',
    keys: true,
    mouse: true,
    alwaysScroll: true,
    scrollable: true,
    scrollbar: {
        ch: ' ',
        bg: 'red'
    }
});

let self = {
    body: body,
    screen: null,
    newUserMessage: function(){ 
        body.content = `{center} new user (ctrl-c to exit){/center}`;
        self.screen.render();
    },
    message: function(message) {
        body.pushLine(message)
    }
}

// for use in index.js
module.exports = body;