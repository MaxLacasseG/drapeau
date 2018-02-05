"use strict"

var JOUEUR = {};
JOUEUR.socket = io.connect();

//Requêtes envoyées au serveur
JOUEUR.nouveauJoueur = function(){
    JOUEUR.socket.emit('nouveauJoueur');
};
JOUEUR.monID = function(){
    //console.log(JOUEUR.drapeauID);
    //JOUEUR.socket.emit('monID', JOUEUR.id);
};

JOUEUR.majPosition = function(id, posX, posY){
    JOUEUR.socket.emit('majPosition', {id:id, x:posX, y:posY});
};

//=====================================
//=====================================
//Écouteurs de signaux du serveur
JOUEUR.socket.on('nouveauJoueur', function(joueur){
    JOUEUR.jeu.state.states.Jeu.ajouterJoueur(joueur.id,joueur.x,joueur.y);
    JOUEUR.jeu.state.states.Jeu.modifierCouleur(joueur.id);
});
JOUEUR.socket.on('assignerID',function(id){
    JOUEUR.drapeauID = id;
});

JOUEUR.socket.on('recupererJoueurs', function(tabJoueurs){
    for(var i = 0; i < tabJoueurs.length; i++){
        JOUEUR.jeu.state.states.Jeu.ajouterJoueur(tabJoueurs[i].id, tabJoueurs[i].x, tabJoueurs[i].y);
        JOUEUR.jeu.state.states.Jeu.modifierCouleur(tabJoueurs[i].id);
    }
});

JOUEUR.socket.on('enleverJoueur', function(joueur){
    JOUEUR.jeu.state.states.Jeu.enleverJoueur(joueur);
});

JOUEUR.socket.on('deplacement', function(joueur){
    JOUEUR.jeu.state.states.Jeu.majPosition(joueur.id, joueur.x, joueur.y);
})
