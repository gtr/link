var blessed = require('blessed');

var notification = blessed.box({
    top: 14,
    left: 'center',
    height: '20%',
    width: '100%',
    border: {
        type: 'line'
    },
    keys: true,
    mouse: true,
    alwaysScroll: true,
    scrollable: true,
    // style: {
    //     border: {
    //         fg: '#f0f0f0'
    //     },
    // },
    scrollbar: {
        ch: ' ',
        bg: 'red'
    }
});

// for use in index.js
module.exports = notification;