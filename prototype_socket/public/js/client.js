"use strict"
/* jshint esversion: 6*/
var JOUEUR = {};
JOUEUR.socket = io.connect();
let boiteMsg;
let msgGabarit;

window.addEventListener('load', function(){
    boiteMsg = document.querySelector(".boiteMsg");
    msgGabarit = boiteMsg.querySelector(".msg.gabarit");
})

//Requêtes envoyées au serveur
JOUEUR.nouveauJoueur = function(){
    let conteneur = document.querySelector('#jeuConteneur');
    let equipe = conteneur.dataset.equipe;
    let nom = conteneur.dataset.nom;
    JOUEUR.socket.emit('nouveauJoueur', {equipe:equipe, nom:nom});
    JOUEUR.socket.emit('getPoints', {equipe:equipe, nom:nom});
};

//Indique au serveur un changement de position
JOUEUR.majPosition = function(id, posX, posY, frame, sens){
    JOUEUR.socket.emit('majPosition', {id:id, x:posX, y:posY, frame:frame, sens:sens});
};

JOUEUR.socket.on('afficherMessage', function(data){
    let clone = msgGabarit.cloneNode(true);
    let span = document.createElement('span');
    span.classList.add('auteur');
    span.innerText = data.auteur;
    let text = document.createTextNode(data.msg);
    clone.appendChild(span);
    clone.appendChild(text);
    clone.classList.remove('gabarit');
    boiteMsg.appendChild(clone);
    boiteMsg.scrollTop = boiteMsg.scrollHeight;
})

// GESTION DU DRAPEAU
//=====================================================
JOUEUR.socket.on('placerDrapeau', function(drapeau){
    JOUEUR.jeu.state.states.Jeu.placerDrapeau(drapeau);
});


JOUEUR.attraperDrapeau = function(position, visible, equipe){
    let drapeau = {
        posX: position.x,
        posY: position.y,
        visible:visible,
        equipe: equipe,
    }
    JOUEUR.socket.emit('attraperDrapeau');
    JOUEUR.socket.emit('setDrapeau', drapeau);
}


JOUEUR.deposerDrapeau = function(position, visible, equipe){
    let drapeau = {
        posX: position.x,
        posY: position.y,
        visible:visible,
        equipe: equipe,
    }
    JOUEUR.socket.emit('deposerDrapeau');
    JOUEUR.socket.emit('setDrapeau', drapeau);
}

JOUEUR.recupererDrapeau = function(){
    JOUEUR.socket.emit('getDrapeau');
}
// GESTION DES PROJECTILES
//=====================================================
JOUEUR.tir = function(posX, posY, pointerX, pointerY,id){
    JOUEUR.socket.emit('tirProjectile', {posX:posX, posY:posY, id:id, pointerX:pointerX, pointerY:pointerY});
};
JOUEUR.socket.on('syncProjectile', function(projectile){
    JOUEUR.jeu.state.states.Jeu.syncProjectile(projectile);
});

JOUEUR.eliminerJoueur = function (id, position){
    let data={
        id: id,
        posX:position.x,
        posY:position.y
    }
    JOUEUR.socket.emit('eliminerJoueur', data);
};
JOUEUR.socket.on('replacerJoueur', function(data){
    JOUEUR.jeu.state.states.Jeu.replacerJoueur(data);
});

// GESTION DES POINTS
//=====================================================
JOUEUR.demarrerPoints= function(){
    JOUEUR.socket.emit('augmenterPoints');
}

JOUEUR.socket.on('majPoints', function(data){
    let equipe1 = document.querySelector('.pointageConteneur .pointEquipe1').innerText = data[1].points;
    let equipe2 = document.querySelector('.pointageConteneur .pointEquipe2').innerText = data[2].points;
    let equipe3 = document.querySelector('.pointageConteneur .pointEquipe3').innerText = data[3].points;
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

JOUEUR.socket.on('ajouterPoints', (points)=>{
    console.log(points.points);
});
