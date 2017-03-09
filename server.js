var http = require('http'),
    fs = require('fs'),
    server = http.createServer(),
    io = require('socket.io').listen(server),
    userlist = [];

server.on('request', function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

io.sockets.on('connection', function (socket, pseudo) {
    socket.on('new_user', function(pseudo) {
        userlist.push(pseudo);
        socket.pseudo = pseudo;
        socket.emit('online_users', userlist);
        socket.broadcast.emit('online_users', userlist);
        console.log('Nombre de connectés : '+userlist.length);
    });

    socket.on('new_message', function (message) {
        socket.broadcast.emit('new_message', {pseudo: socket.pseudo, message: message});
    });

    socket.on("disconnect", function () {
        var index = userlist.indexOf(socket.pseudo);
        if(index != -1) userlist.splice(index, 1);
        socket.broadcast.emit('online_users', userlist);
        console.log('Nombre de connectés : '+userlist.length);
    });
});
server.listen(8080);
