/*jshint esversion: 6 */
"use strict";
var DRAPEAU = DRAPEAU || {};

DRAPEAU = {
};

window.addEventListener("load", function(){
    let parent = document.querySelector('#jeuConteneur');
    let w = parent.clientWidth;
    let h = parent.clientHeight;
    
    var config = {
        height : h,
        width: w,
        parent: "jeuConteneur",
        scaleMode: Phaser.ScaleManager.USER_SCALE
    };
    
    var jeu = new Phaser.Game(config);
    jeu.state.add("Demarrage", DRAPEAU.Demarrage);
    jeu.state.add("Jeu", DRAPEAU.Jeu);

    jeu.state.start("Demarrage");
    JOUEUR.jeu = jeu;
},false);