// server setup
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// on connection
io.on('connection', function (socket){
    console.log('user connected')
    socket.on('disconnect', function () {
        console.log('user disconnected')
    });
});

// listen for requests on port 4000
http.listen(4000, function () {
    console.log('listening on port 4000');
});