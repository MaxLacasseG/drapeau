"use strict"
/* jshint esversion: 6*/
var JOUEUR = {};
JOUEUR.socket = io.connect();

//Requêtes envoyées au serveur
JOUEUR.nouveauJoueur = function(){
    let conteneur = document.querySelector('#jeuConteneur');
    let equipe = conteneur.dataset.equipe;
    let nom = conteneur.dataset.nom;
    console.log('nouveauJoueur:', equipe, nom);
    JOUEUR.socket.emit('nouveauJoueur', {equipe:equipe, nom:nom});
};
JOUEUR.majPosition = function(id, posX, posY){
    JOUEUR.socket.emit('majPosition', {id:id, x:posX, y:posY});
};

//=====================================
//Écouteurs de signaux du serveur
//=====================================

// Gestion des utilisateurs
JOUEUR.socket.on('nouveauJoueur', function(joueur){
    JOUEUR.jeu.state.states.Jeu.ajouterJoueur(joueur.id,joueur.x,joueur.y, joueur.equipe, joueur.nom);
    JOUEUR.jeu.state.states.Jeu.assignerEquipe(joueur.equipe);
});
JOUEUR.socket.on('assignerID',function(id){
    JOUEUR.drapeauID = id;
});

JOUEUR.socket.on('recupererJoueurs', function(tabJoueurs){
    for(let joueur of tabJoueurs){
        JOUEUR.jeu.state.states.Jeu.ajouterJoueur(joueur.id, joueur.x, joueur.y, joueur.equipe, joueur.nom);
        JOUEUR.jeu.state.states.Jeu.assignerEquipe(joueur.equipe, joueur.id);
    }
});

JOUEUR.socket.on('enleverJoueur', function(joueur){
    JOUEUR.jeu.state.states.Jeu.enleverJoueur(joueur);
});

JOUEUR.socket.on('deplacement', function(joueur){
    JOUEUR.jeu.state.states.Jeu.majPosition(joueur.id, joueur.x, joueur.y);
});

// Gestion du drapeau
JOUEUR.socket.on('assignerDrapeauPos', function(drapeau){
    JOUEUR.jeu.state.states.Jeu.assignerDrapeau(drapeau);
});

JOUEUR.socket.on('attribuerDrapeau', function(drapeau, id){
    console.log('drapeau attrapé');
});

JOUEUR.socket.on('majDrapeauPos', function(drapeau){
    console.log(JOUEUR.jeu.state.states.Jeu.assignerDrapeau);
    JOUEUR.jeu.state.states.Jeu.assignerDrapeau(drapeau);
});