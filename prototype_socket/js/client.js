"use strict"

var JOUEUR = {};
JOUEUR.socket = io.connect();

JOUEUR.nouveauJoueur = function(){
    JOUEUR.socket.emit('nouveauJoueur');
};