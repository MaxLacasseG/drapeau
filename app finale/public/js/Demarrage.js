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
        //this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.stage.backgroundColor = "FFFFFF";
        this.input.maxPointers = 1;
    },

    create: function() {
        console.log("DEMARRÉ");
        this.game.state.start("ChargementMedias");
    }
};
