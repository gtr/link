var blessed = require('blessed');

// screen object
var screen = blessed.screen({
    smartCSR: true
});

// for use in index.js
module.exports = screen;