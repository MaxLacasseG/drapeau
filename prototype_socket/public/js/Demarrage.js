"use strict";

var DRAPEAU = DRAPEAU || {};
////////////////////////////////
//         Démarrage          //
////////////////////////////////

//Script servant à initialiser les contrôles

DRAPEAU.Demarrage = function() {};

DRAPEAU.Demarrage.prototype = {
    init: function() {
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.stage.backgroundColor = "#000000";
    },

    create: function() {
        this.game.state.start("Jeu");
    }
};
