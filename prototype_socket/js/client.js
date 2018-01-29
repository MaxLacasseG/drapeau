"use strict"

var JOUEUR = {};
JOUEUR.socket = io.connect();

//Requêtes envoyées au serveur
JOUEUR.nouveauJoueur = function(){
    JOUEUR.socket.emit('nouveauJoueur');
};


//Écouteurs de signaux en attente du serveur
JOUEUR.socket.on('nouveauJoueur', function(data){
    //DRAPEAU.Jeu.ajouterJoueur(data.id,data.x,data.y);
    //console.log("nouveau joueur");
    
});

JOUEUR.socket.on('recupererJoueurs', function(data){
    //console.log(data);
    for(var i = 0; i < data.length; i++){
        console.log(data[i]);
        //console.log(JOUEUR.jeu.state.states.Jeu.ajouterJoueur);
        JOUEUR.jeu.state.states.Jeu.ajouterJoueur(data[i].id, data[i].x, data[i].y);
    }
});