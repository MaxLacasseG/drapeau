"use strict";


var RECOLTES = RECOLTES || {};
////////////////////////////////
//          EcranFinJeu       //
////////////////////////////////


/**
 * Classe permettant de définir l'écran (state)
 * pour la scène de la fin du jeu
 */

RECOLTES.FinJeu = function FinJeu() {};

RECOLTES.FinJeu.prototype = {

    init: function(score) {
        this.sound.stopAll();
        RECOLTES.score = score;
    },

    create: function() {
        //Image d'into
        this.add.audio("sonIntro", 0.6).play();
        var fondInstruction = this.add.image(0, 0, "fondRejouer");

        //Vérification et enregistrement du meilleur score
        RECOLTES.meilleurScore = Math.max(RECOLTES.score, RECOLTES.meilleurScore);
        localStorage.setItem(RECOLTES.NOM_LOCAL_STORAGE, RECOLTES.meilleurScore);

        var leTexte = "Votre score : " + RECOLTES.score + "\nLe meilleur score : " + RECOLTES.meilleurScore;
        var finJeuTxt = this.add.text(this.game.width - RECOLTES.TAILLE_BLOC, RECOLTES.TAILLE_BLOC * 2, leTexte, {
            font: "bold 40px Noteworthy",
            fill: "#40180A",
            align: "right"
        });
        finJeuTxt.anchor.set(1, 0.5);

        // Créer le bouton pour rejouer
        var boutonJouer = this.add.button(this.game.width - RECOLTES.TAILLE_BLOC, RECOLTES.TAILLE_BLOC * 3, "rejouerBtn", this.rejouer, this, 1, 0, 1, 0);
        boutonJouer.anchor.set(1, 0.5);

    },

    rejouer: function() {
            //Aller à l'écran de jeu
            this.sound.stopAll();
            this.game.state.start("Jeu");
        } //Fin rejouer
}; // Fin FinJeu.prototype