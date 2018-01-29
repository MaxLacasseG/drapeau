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
app.idDernierJoueur = 0;
io.on('connection',function(socket){
    //Gestion des nouveaux utilisateurs
    socket.on('nouveauJoueur',function(){
        console.log("nouveauJoueur");
        socket.joueur = {
            id: app.idDernierJoueur++,
            x:attribuerPosition(0, 200),
            y:attribuerPosition(0, 200)
        },
        socket.emit('recupererJoueurs', recupererJoueurs());
        socket.broadcast.emit('nouveauJoueur', socket.joueur);

       //Gestion de la deconnection 
       socket.on('disconnect', function(){
           console.log("deconnection:"+socket.joueur.id);
            io.emit('enleverJoueur', socket.joueur.id);
       });
    });
});

function attribuerPosition(min, max){
    var position = Math.floor((Math.random()*max)+min);
    return parseInt(position);
}
function recupererJoueurs(){
    var tabJoueurs = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var joueur = io.sockets.connected[socketID].joueur;
        if(joueur) tabJoueurs.push(joueur);
    });
    return tabJoueurs;
}
