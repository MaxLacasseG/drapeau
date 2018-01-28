"use strict";

var RECOLTES = RECOLTES || {};

////////////////////////////////
//        Instructions        //
////////////////////////////////

RECOLTES.Instructions = function() {};

RECOLTES.Instructions.prototype = {
    create: function() {
        // //Image d'into
        var fondInstruction = this.add.image(0, 0, "fondInstructions");

        // //Bouton
        var boutonJouer = this.add.button(this.game.width, this.game.height - RECOLTES.TAILLE_BLOC / 2, "jouerBtn", this.allerEcranJeu, this, 1, 0, 1, 0);
        boutonJouer.anchor.set(1, 0.5);

    },

    allerEcranJeu: function() {
        //Démarrer l'écran du jeu
        this.sound.stopAll();
        this.game.state.start("Jeu");
    }
}; // Fin Instructions.prototype