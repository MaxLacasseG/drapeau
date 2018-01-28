var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css', express.static(__dirname+'/css'));
app.use('/js', express.static(__dirname+'/js'));
app.use('/medias', express.static(__dirname+'/medias'));
app.use('/lib', express.static(__dirname+'/lib'));


app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
});

server.listen(8081,function(){ // Listens to port 8081
    console.log('Listening on '+server.address().port);
});

io.on('connection',function(socket){
    socket.on('nouveauJoueur',function(){
       console.log("Joueur connecté:"+socket.id);
    });
});