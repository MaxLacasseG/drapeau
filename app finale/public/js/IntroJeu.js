"use strict";
var RECOLTES = RECOLTES || {};


    ////////////////////////////////
    //          IntroJeu          //
    ////////////////////////////////

    /**
      * @class IntroJeu
      * @desc Classe permettant de définir l'écran (state) pour la scène d'intro du jeu
      */

      RECOLTES.IntroJeu = function (){
        this.laMusique;
      };

      RECOLTES.IntroJeu.prototype = {
        create: function(){
            // //Image d'intro
            var fondInstructions = this.add.image(0,0, "fondIntro");
            
            // //Bouton
            var boutonJouer = this.add.button(RECOLTES.TAILLE_BLOC/2, RECOLTES.TAILLE_BLOC*2,"jouerBtn", this.allerEcranJeu, this, 1,0,1,0);
            var boutonInstructions = this.add.button(RECOLTES.TAILLE_BLOC/2,RECOLTES.TAILLE_BLOC*3,"instructionsBtn", this.allerEcranInstructions, this, 1,0,1,0);
            
            this.add.tween(boutonJouer).from({y: -boutonJouer.height, angle: 30}, 1000, Phaser.Easing.Elastic.Out, true);
            this.add.tween(boutonInstructions).from({y:-boutonInstructions.height, angle:30}, 1000, Phaser.Easing.Elastic.Out, true);

            //Son d'intro
            this.laMusique = this.add.audio("sonIntro",0.6, true).play();
          },

          allerEcranJeu: function(){
            // //Démarrer l'écran du jeu
            this.sound.stopAll();
            this.game.state.start("Jeu");
          },

          allerEcranInstructions: function(){
            // //Démarrer l'écran du jeu
            this.game.state.start("Instructions");
          }
    }; // Fin IntroJeu.prototype
