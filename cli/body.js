var blessed = require('blessed');

var body = blessed.box({
    top: 0,
    left: 0,
    height: '100%-1',
    width: '100%',
    keys: true,
    mouse: true,
    tags: true,
    alwaysScroll: true,
    scrollable: true,
});

// for use in index.js
module.exports = body;