var express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    path = require('path'),
    io = require("socket.io").listen(server);

    users = [];
    connections = [];

    server.listen(process.env.Port || 3000);
    console.log("Server running...");
    //serve static file
    app.use(express.static(path.join(__dirname)));
    app.get("/", function(req, res) {
        res.sendFile(__dirname + "/index.html");
    });

    io.sockets.on("connection", function(socket) {
        connections.push(socket);
        console.log("Connected: %s sockets connected", connections.length);
        
        //Disconnect 
        socket.on("disconnect", function(data) {
            users.splice(users.indexOf(socket),1);
            updateUsername();
            connections.splice(connections.indexOf(socket),1);
            console.log("Disconnected: %s sockets connected", connections.length);
        });

        //Send message
        socket.on('send message', function(data) {
            io.sockets.emit('new message', {msg: data, user: socket.username});
        });

        // New user
        socket.on('new user', function(data, callback) {
            callback(true);
            socket.username = data;
            users.push(socket.username);
            updateUsername();
        })

        function updateUsername() {
            io.sockets.emit('get users', users);
        }
    })
