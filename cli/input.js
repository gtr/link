var blessed = require('blessed');

var input = blessed.textbox({
    bottom: 0,
    left: 0,
    height: 1,
    width: '100%',
    keys: true,
    mouse: true,
    inputOnFocus: true,
    style: {
        fg: 'white',
        border: {
            fg: '#f0f0f0'
        },
        bg: 'grey'
    }
});

// screen.key(['escape', 'q', 'C-c'], function (ch, key) {
//     return process.exit(0);
// });

// for use in index.js
module.exports = input;