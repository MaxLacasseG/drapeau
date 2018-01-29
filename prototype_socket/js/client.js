"use strict"

var JOUEUR = {};
JOUEUR.socket = io.connect();

//Requêtes envoyées au serveur
JOUEUR.nouveauJoueur = function(){
    JOUEUR.socket.emit('nouveauJoueur');
};

//Écouteurs de signaux en attente du serveur
JOUEUR.socket.on('nouveauJoueur', function(data){
    JOUEUR.jeu.state.states.Jeu.ajouterJoueur(data.id,data.x,data.y);
});

JOUEUR.socket.on('recupererJoueurs', function(data){
    console.log(data);
    for(var i = 0; i < data.length; i++){
        JOUEUR.jeu.state.states.Jeu.ajouterJoueur(data[i].id, data[i].x, data[i].y);
    }
});