var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/js', express.static(__dirname+"/js"));

app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
});

server.listen(8082,function(){ // Listens to port 8081
    console.log('Listening on '+server.address().port);
});


io.on('connection', function(socket){
    console.log('connexion');

    socket.on('nouveauMsg', function(data){
        console.log("message recu");
        io.sockets.emit('afficherMsg', data);
    });
});
