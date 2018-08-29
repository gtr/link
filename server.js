// server setup
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// array to store handles
var handlesArray = ["admin"];

// on connection...
io.on('connection', function (socket){
    console.log('user connected')
    handle = ""
    // on submitted handle
    socket.on('submitHandle', function (data) {
        handle = data.handle
        id = data.id
        var exists = false;
        handlesArray.forEach(function (item) {
            if (item == handle) {
                exists = true
            };
        });
        if (exists == false) {
            handlesArray.push(handle)
            io.sockets.connected[id].emit('enterChat', handle);
        } else {
            console.log('user exists')
            io.sockets.connected[id].emit('failed', handle);
        };
        console.log('new user:', handle)
    })
    
    // on new user
    socket.on('newUser', function (data) {
        io.sockets.emit('newUser', data);
    })
    
    // on entering chat
    socket.on('enterChat', function (data) {
        handle = data.handle
        id = data.id
        console.log('entering chat for', handle)
        io.sockets.connected[id].emit('enterChat', handle);
    })
    
    // on disconnected user
    socket.on('disconnect', function () {
        handlesArray = handlesArray.filter(function (item) {
            return item !== handle
        });
        console.log('user disconnected', handle)
        console.log('current users:', handlesArray)
    });
    
    // on chat connection
    socket.on('chat', function (data) {
        message = data.message;
        handle = data.handle;
        io.sockets.emit('chat', data);
        console.log('message:', data.message)
    })
});

// listen for requests on port 4000
http.listen(4000, '0.0.0.0', function () {
    console.log('listening on port 4000');
});
