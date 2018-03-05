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

//Indique au serveur un changement de position
JOUEUR.majPosition = function(id, posX, posY, frame, sens){
    JOUEUR.socket.emit('majPosition', {id:id, x:posX, y:posY, frame:frame, sens:sens});
};


// GESTION DU DRAPEAU
//=====================================================
JOUEUR.socket.on('assignerDrapeauPos', function(drapeau){
    JOUEUR.jeu.state.states.Jeu.assignerDrapeau(drapeau);
});
//Indique au serveur lorsque le joueur attrape un drapeau
JOUEUR.attraperDrapeau = function(id, equipe){
    JOUEUR.socket.emit('attraperDrapeau', {id:id, equipe:equipe});
};

//Retour du serveur
JOUEUR.socket.on('drapeauEnDeplacement', function(id){
    console.log(id + " a le drapeau");
    JOUEUR.jeu.state.states.Jeu.drapeauEnDeplacement();
});

//Indique au serveur lorsque le joueur attrape un drapeau
JOUEUR.deposerDrapeau = function(id, posX, posY, equipe){
    JOUEUR.socket.emit('deposerDrapeau', {id:id, posX:posX, posY:posY, equipe:equipe});
};

//Retour du serveur
JOUEUR.socket.on('majDrapeau', function(data){
    console.log(data);
    console.log(data.id + " a déposé le drapeau");
    JOUEUR.jeu.state.states.Jeu.majPositionDrapeau(data);
});

// GESTION DES PROJECTILES
//=====================================================
JOUEUR.tir = function(posX, posY, pointerX, pointerY,id){
    JOUEUR.socket.emit('tirProjectile', {posX:posX, posY:posY, id:id, pointerX:pointerX, pointerY:pointerY});
};
JOUEUR.socket.on('syncProjectile', function(projectile){
    JOUEUR.jeu.state.states.Jeu.syncProjectile(projectile);
});

//=====================================
//Écouteurs de signaux du serveur
//=====================================

// Gestion des utilisateurs
JOUEUR.socket.on('nouveauJoueur', function(joueur){
    JOUEUR.jeu.state.states.Jeu.ajouterJoueur(joueur.id,joueur.x,joueur.y, joueur.equipe, joueur.nom);
});
JOUEUR.socket.on('assignerID',function(id){
    JOUEUR.drapeauID = id;
});

JOUEUR.socket.on('recupererJoueurs', function(tabJoueurs){
    for(let joueur of tabJoueurs){
        JOUEUR.jeu.state.states.Jeu.ajouterJoueur(joueur.id, joueur.x, joueur.y, joueur.equipe, joueur.nom);
    }
});

JOUEUR.socket.on('enleverJoueur', function(joueur){
    JOUEUR.jeu.state.states.Jeu.enleverJoueur(joueur);
});

JOUEUR.socket.on('deplacement', function(joueur){
    JOUEUR.jeu.state.states.Jeu.majPosition(joueur.id, joueur.x, joueur.y, joueur.frame, joueur.sens);
});

