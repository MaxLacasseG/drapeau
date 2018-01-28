/**
 * Classe Ecran  
 * pour le cours 582-448-MA
 * @author Johanne Massé
 * @version 2017-04-26
 * Fortement inspiré de : Screen Orientation API Demo by Aurelio De Rosa (Version 5 Juillet 2016)
 * @see https://github.com/AurelioDeRosa/HTML5-API-demos
 */
(function () { //  IIFE
	"use strict";

	/**
	 * Gère le mode d'affichage de l'écran du périphérique de diffusion
	 * 
	 * @class Ecran
	 * @static
	 */
	function Ecran() {
		throw "Ecran est une classe static et ne peut donc pas être instanciée!!!";
	};

	//Propriété privée

	/**
	 * Identifie le préfixe propriétaire requis pour l'API Screen Orientation
	 * @property {String} _prefix
	 * @private
	 */
	var _prefix = 'orientation' in screen ? '' :
		'mozOrientation' in screen ? 'moz' :
		'msOrientation' in screen ? 'ms' : null;


	//Constantes publiques

	/**
	 * L'affichage de l'application est en mode portrait
	 *
	 * @constant
	 * @type {String}
	 */
	Ecran.PORTRAIT = "portrait-primary";

	/**
	 * L'affichage de l'application est en mode paysage
	 *
	 * @constant
	 * @type {String}
	 */
	Ecran.PAYSAGE = "landscape-primary";


	//Méthodes publiques

	/**
	 * Permet de mettre l'affichage de la page Web en mode plein écran
	 */
	Ecran.mettrePleinEcran = function () {
		var element = document.documentElement;
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	};

	/**
	 * Enlève l'affichage de la page Web en mode plein écran
	 */
	Ecran.enleverPleinEcran = function () {
		var element = document.documentElement;
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	}

	/**
	 * Permet de bloquer l'écran en mode paysage ou portrait
	 * si l'application est en mode plein-écran 
	 * 
	 * @param {String} orientationEcran Orientation souhaité défini avec les constantes de classes
	 * @return {Boolean} Retourne true à gérer au besoin lorsque l'écran est verrouillé
	 */
	Ecran.verrouillerEcran = function (orientationEcran) {
		//Si c'est possible (c.-à-d. si le navigateur intègre l'API), on va bloquer l'orientation du périphérique

		if (_prefix != null && (orientationEcran == Ecran.PAYSAGE || orientationEcran == Ecran.PORTRAIT)) {

			//Mettre un petit délai pour être certain que l'application est déjà en mode pleinEcran car c'est une condition pour bloquer l'orientation de l'écran

			window.setTimeout(function () {

				// Vérifier quelle version de l'API est implémentée dans le navigateur
				if ('orientation' in screen && 'angle' in screen.orientation) {
					screen.orientation.lock(orientationEcran);

				} else {
					screen[_prefix + (_prefix === '' ? 'l' : 'L') + 'ockOrientation'](orientationEcran);
				}

			}, 100);

			//Au besoin...
			return true;
		}

	}; // Fin verrouillerEcran


	/**
	 * Enlève le blocage de l'orientation de l'écran
	 * @return {Boolean} Retourne false à gérer au besoin lorsque l'écran est déverrouillé
	 */
	Ecran.deVerrouillerEcran = function () {
		//Si c'est possible, on va débloquer l'orientation du périphérique

		if (_prefix != null) {
			// Vérifier quelle version de l'API est implémentée dans le navigateur
			if ('orientation' in screen && 'angle' in screen.orientation) {
				screen.orientation.unlock();

			} else {
				screen[_prefix + (_prefix === '' ? 'u' : 'U') + 'nlockOrientation']();
			}
		}

		//Au besoin...
		return false;

	}; // Fin deVerrouillerEcran       


	//Mettre la classe publique
	window.Ecran = Ecran;

})(); //Fin IIFE
