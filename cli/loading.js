var blessed = require('blessed');

// Create a loading box perfectly centered horizontally and vertically.
var loading = blessed.box({
    top: 'center',
    left: 'center',
    width: '50%',
    height: '20%',
    content: '{bold}Connecting to... http://localhost:4000{/bold}!',
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

module.exports = loading;