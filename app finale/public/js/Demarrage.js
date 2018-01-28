"use strict";

var RECOLTES = RECOLTES || {};
////////////////////////////////
//         Démarrage          //
////////////////////////////////

RECOLTES.Demarrage = function() {};

RECOLTES.Demarrage.prototype = {
    init: function() {
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        this.input.maxPointers = 1;
    },

    create: function() {
        this.game.state.start("ChargementMedias");
    }
};
