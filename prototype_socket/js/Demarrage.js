"use strict";

var DRAPEAU = DRAPEAU || {};
////////////////////////////////
//         Démarrage          //
////////////////////////////////

//Script servant à initialiser les contrôles

DRAPEAU.Demarrage = function() {};

DRAPEAU.Demarrage.prototype = {
    init: function() {
    
    },

    create: function() {
        console.log("DEMARRÉ");
        this.game.state.start("Jeu");
    }
};
