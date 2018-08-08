// server setup
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// on connection...
io.on('connection', function(socket){
    console.log('user connected')
    // on new user...
    socket.on('newUser', function(data) {
        io.sockets.emit('newUser', data);
    })
    // on disconnected user...
    socket.on('disconnect', function () {
        console.log('user disconnected')
    });
    // on chat connection...
    socket.on('chat', function(data) {
        message = data.message;
        handle = data.handle;
        io.sockets.emit('chat', data);
        console.log('message:', data.message)
    })
});

// listen for requests on port 4000
http.listen(4000, function() {
    console.log('listening on port 4000');
});
