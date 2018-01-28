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

//Section de gestion des événements sockets
//Eve. lancée lors d'une connexion au serveur
io.on('connection',function(socket){
    //Gestion des nouveaux utilisateurs
    socket.on('nouveauJoueur',function(){

       //Gestion de la deconnection 
       socket.on('disconnect', function(){
            console.log("déconnecté");
       });
    });
});