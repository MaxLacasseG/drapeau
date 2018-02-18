"use strict"

var DRAPEAU = DRAPEAU || {};

DRAPEAU = {
    // Variables de jeu
    instance:null
};

window.addEventListener("load", function(){
    var config = {
        height : 600,
        width: 600,
        parent: "jeuConteneur"
    };

    var jeu = new Phaser.Game(config);
    jeu.state.add("Demarrage", DRAPEAU.Demarrage);
    jeu.state.add("Jeu", DRAPEAU.Jeu);

    jeu.state.start("Demarrage");
    this.instance = jeu;
    JOUEUR.jeu = jeu;
},false);