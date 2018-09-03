// server setup
const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient;
const http = require('http').Server(app);
const io = require('socket.io')(http);
var url = 'mongodb://localhost:27017/';
var dbName = 'ultra-chat';

// connect to mongoDB 
mongo.connect(url, {useNewUrlParser: true}, function (err, client) {
    if (err) {
        throw err
    };

    // connect to ultra-chat db
    var db = client.db(dbName);
    console.log('connected to:', dbName);

    // create users collection and admin
    let users = db.collection('users');
    users.removeMany({}, function () {
        console.log('user collection cleared')
    });
    users.insertOne({handle: 'admin'})
    
    // create messages collection
    let messages = db.collection('messages');
    messages.removeMany({}, function () {
        // messages cleared
    });
    // on websocket connection...
    io.on('connection', function (socket) {
        var handle = ''
        
        // on submitted handle
        socket.on('submitHandle', function (data) {
            var handle = data.handle
            
            if (handle.length > 1) {

                id = data.id
                
                users.findOne({handle: handle}, function(err, user) {
                    if (err) {
                        throw err
                    };
                    
                    if (user) {
                        console.log('user exists')
                        io.sockets.connected[id].emit('failed', handle);
                    } else {
                        users.insertOne({handle: handle});
                        io.sockets.connected[id].emit('enterChat', handle);
                    }
                });
            }
        });
        
        // on new user
        socket.on('newUser', function (data) {
            io.sockets.emit('newUser', data);
        })
        
        // when entering chatroom
        socket.on('enterChat', function (data) {
            var handle = data.handle
            var id = data.id
            console.log('entering chat for', handle)
            io.sockets.connected[id].emit('enterChat', handle);
        })
        
        // on disconnected user
        socket.on('disconnect', function () {
            console.log('disconnect', handle)
            // deleting user from database collection
            var myquery = { handle: handle };
            users.deleteOne(myquery, function (err, obj) {
                if (err) {
                    throw err;
                }
            });

            console.log('user disconnected', handle)
        });
        
        // on request to load previous messages
        socket.on('loadMessages', function (data) {
            var id = data.id

            // retrieve messages 
            messages.find({}).toArray(function (err, result) {
                if (err) {
                    throw err;
                }

                // iterate through all the result's objects
                for (i = 0; i < result.length; i++) {
                    messageData = result[i]

                    // emit each instance of message data
                    io.sockets.connected[id].emit('chat', messageData);            
                };
            });
        });

        // when a chat is sent
        socket.on('chat', function (data) {
            handle = data.handle;
            message = data.message;

            // insert into messages collection
            messages.insertOne({handle: handle, message: message}, function(){

                // emit the data to clients
                io.sockets.emit('chat', data);
        });
        });
    })
})

// listen for requests on port 4000
http.listen(4000, '0.0.0.0', function () {
    console.log('listening on port 4000');
});
