"use strict";

var DRAPEAU = DRAPEAU || {};
////////////////////////////////
//          EcranJeu         //
////////////////////////////////

DRAPEAU.Jeu = function () {
    //DÉCLARATIONS DES PROPRIÉTÉS
    //Le nombre de blocs du jeu
    var fleches;
    var perso;
    var tabPerso;
    var map, couches;
    var peutCommencer = false;
    var signaux;
    var drapeau;
    var dansSaBase = false;
    var estMort = false;
    var projectiles;
    var ratioTir;
    var prochainTir;
    var points = false;

};

DRAPEAU.Jeu.prototype = {
    /**
     * Fonction d'initialisation de Phaser, appelé à la première lecture du script
     * Initialise le tableau de personnage
     * Initialise les valeurs du drapeau
     */
    init: function () {
        this.tabPerso = {};
        this.game.stage.disableVisibilityChange = true;
        this.drapeau = {
            x: 0,
            y: 0,
            equipe: null,
            joueur: null
        };
        this.ratioTir = 200;
        this.prochainTir = 0;
        this.points = false;
    },
    /**
     * Fonction de chargement des médias
     */
    preload: function () {
        this.game.load.tilemap('carte', 'medias/carte/carte2.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('environnement', 'medias/carte/tileset.png');
        this.game.load.image('perso', 'medias/img/hero-idle-side.png');
        this.game.load.image('drapeau', 'medias/img/gem-1.png');
        this.game.load.spritesheet('persoMarche', 'medias/img/persoSpritesheet.png', 32, 32);
        this.game.load.spritesheet('taupeMarche', 'medias/img/taupeSpritesheet.png', 32, 32);
        this.game.load.spritesheet('arbreMarche', 'medias/img/arbreSpritesheet.png', 32, 32);
        this.game.load.spritesheet('mort', 'medias/img/enemy-death.png', 32, 32);
        this.game.load.image('projectile', 'medias/img/gem-1.png');
    },
    create: function () {
        this.signaux = new Phaser.Signal();
        this.signaux.add(this.toucheBase, this);

        //Démarrage du système de physique
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.creerCarte();
        this.game.world.setBounds(0, 0, 1600, 1600);

        this.projectiles = this.game.add.group();
        this.projectiles.enableBody = true;
        this.projectiles.physicsBodyType = Phaser.Physics.ARCADE;
        this.projectiles.createMultiple(50, 'projectile');
        this.projectiles.setAll('checkWorldBounds', true);
        this.projectiles.setAll('outOfBoundsKill', true);

        //Ajout du personnage    
        //Message au serveur

        JOUEUR.nouveauJoueur();

        //Enregistrement des touches de jeu
        this.fleches = this.game.input.keyboard.createCursorKeys();
    },
    // =========================
    // ==== GESTION JOUEUR
    /**
     * Fonction servant à ajouter un joueur à la partie
     * Appelée par une requête serveur lors de la mise à jour du tableau de joueurs
     * Crée un personnage, ajoute ses animations et sa physique
     * L'ajoute au tableau de joueur
     * Assigne le joueur principal
     * 
     * @param int id 
     * @param int x 
     * @param int y 
     * @param int equipe 
     * @param string nom 
     */
    ajouterJoueur: function (id, x, y, equipe, nom) {
        switch (equipe) {
            case "1":
                this.tabPerso[id] = this.game.add.sprite(x, y, "persoMarche");
                this.tabPerso[id].animations.add('marcheCote', [0, 1, 2, 3, 4, 5]);
                this.tabPerso[id].animations.add('marcheBas', [6, 7, 8, 9, 10, 11]);
                this.tabPerso[id].animations.add('marcheHaut', [12, 13, 14, 15, 16, 17]);
                this.tabPerso[id].animations.add('repos', [1]);
                break;
            case "2":
                this.tabPerso[id] = this.game.add.sprite(x, y, "taupeMarche");
                this.tabPerso[id].animations.add('marcheCote', [0, 1, 2, 3]);
                this.tabPerso[id].animations.add('marcheBas', [4, 5, 6, 7]);
                this.tabPerso[id].animations.add('marcheHaut', [8, 9, 10, 11]);
                this.tabPerso[id].animations.add('repos', [1]);
                break;
            case "3":
                this.tabPerso[id] = this.game.add.sprite(x, y, "arbreMarche");
                this.tabPerso[id].animations.add('marcheCote', [0, 1, 2, 3]);
                this.tabPerso[id].animations.add('marcheBas', [4, 5, 6, 7]);
                this.tabPerso[id].animations.add('marcheHaut', [8, 9, 10, 11]);
                this.tabPerso[id].animations.add('repos', [1]);
                break;
        }

        this.tabPerso[id].anchor.set(0.5);
        this.game.physics.arcade.enable(this.tabPerso[id]);

        this.tabPerso[id].body.collideWorldBounds = true;

        this.tabPerso[id].equipe = equipe;
        this.tabPerso[id].nom = nom;
        this.tabPerso[id].id = id;
        this.creerJoueur();
    },
    /**
     * Fonction servant à assigner le joueur local
     * Permet à la caméra de suivre
     * Démarre la partie dans le update
     */
    creerJoueur: function () {
        this.perso = this.tabPerso[JOUEUR.drapeauID];
        this.game.camera.follow(this.tabPerso[JOUEUR.drapeauID]);
        this.peutCommencer = true;
    },
    /**
     * Enlève un joueur du tableau de personnage à la déconnection
     * Appelé par une requête serveur
     * 
     * @param {any} id 
     */
    enleverJoueur: function (id) {
        //console.log("deconnection:" + this.tabPerso[id].id);
        this.tabPerso[id].destroy();
        delete this.tabPerso[id];
    },
    /**
     * Fonction servant à mettre à jour la position d'un joueur dans le tableau de joueur
     * 
     * @param int id 
     * @param int x 
     * @param int y 
     */
    majPosition: function (id, x, y, frame, sens) {
        this.tabPerso[id].position.x = x;
        this.tabPerso[id].position.y = y;
        this.tabPerso[id].frame = frame;
        this.tabPerso[id].scale.x = sens;
    },
    revivre: function (id) {
        if (!this.estMort) {
            if (this.tabPerso[id].drapeau) {
                this.deposerDrapeau();
                this.drapeau.body.enable = true;
            }
            this.estMort = true;
            console.log("revivre", id);
            this.tabPerso[id].visible = false;
            let mortsprite = this.game.add.sprite(this.tabPerso[id].x, this.tabPerso[id].y, 'mort');
            let mortAnim = mortsprite.animations.add('mort');
            mortsprite.id = id;
            mortAnim.onComplete.addOnce(this.finAnimMort, this);
            mortAnim.play();
        }
    },
    finAnimMort: function (sprite, animation) {
        let id = sprite.id;
        sprite.destroy();
        this.tabPerso[id].x = Math.floor(Math.random() * 600) + 600;
        this.tabPerso[id].y = Math.floor(Math.random() * 600) + 600;
        this.estMort = false;
        this.tabPerso[id].visible = true;
    },
    // =====================================
    // ==== GESTION DE LA CRÉATION DU JEU
    // =====================================
    creerCarte: function () {
        this.map = this.game.add.tilemap('carte');
        this.map.addTilesetImage('environnement', 'environnement');
        this.couches = {
            "fond": this.map.createLayer("fond"),
            "murs": this.map.createLayer("murs"),
            "base": this.map.createLayer("base")
        }
        this.couches.fond.resizeWorld();
        this.couches.murs.resizeWorld();
        this.couches.base.resizeWorld();

        //Crée les collisions avec le jeu
        this.map.setCollisionBetween(1, 1028, true, this.couches.murs);

        //this.map.setCollision(195, true, this.couches.base);
    },

    assignerDrapeau: function (drapeau) {
        this.drapeau = this.game.add.sprite(drapeau.x, drapeau.y, "drapeau");
        this.game.physics.arcade.enable(this.drapeau);
        this.drapeau.body.immovable = true;
    },

    // =====================================
    // ==== GESTION DES INTERACTIONS
    // =====================================
    collisionAvecFond: function (perso, fond) {
        this.signaux.dispatch(this.perso, this.game);
    },
    toucheBase: function (perso, fond) {
        if (this.perso.drapeau == true) {}
        console.log("base");
    },
    prendDrapeau: function (perso, drapeau) {
        if (!this.perso.possedeDrapeau) {
            this.perso.possedeDrapeau = true;
            JOUEUR.attraperDrapeau(perso.id, perso.equipe);
        }
    },
    drapeauEnDeplacement() {
        console.log(this.drapeau.visible);
        this.drapeau.visible = false;
        this.drapeau.body.enable = false;
    },
    deposeDrapeau() {
        this.perso.possedeDrapeau = false;
        JOUEUR.deposerDrapeau(this.perso.id, this.perso.x, this.perso.y, this.perso.equipe);
    },
    majPositionDrapeau(data) {
        this.drapeau.x = data.posX;
        this.drapeau.y = data.posY;
        this.drapeau.visible = true;
        this.game.time.events.add(100, function () {
            this.drapeau.body.enable = true;
        }, this);
    },
    tirProjectile: function (posX, posY) {
        if (this.game.time.now > this.prochainTir && this.projectiles.countDead() > 0) {
            this.prochainTir = this.game.time.now + this.ratioTir;
            let projectile = this.projectiles.getFirstDead();
            projectile.reset(this.perso.x, this.perso.y);
            this.game.physics.arcade.moveToPointer(projectile, 300);

            let angle = this.game.math.angleBetween(this.perso.x, this.perso.y, posX, posY);
            console.log("avant", this.input.activePointer.worldX, this.input.activePointer.worldY);

            //let pointeur = this.game.input.pointer;
            JOUEUR.tir(this.perso.x, this.perso.y, this.input.activePointer.worldX, this.input.activePointer.worldY, this.perso.id);
            //Détruit le projectile après 750 ms, optimisation
            this.game.time.events.add(750, function () {
                projectile.kill();
            }, this);
        }
    },
    syncProjectile: function (projectileInfo) {
        let projectile = this.projectiles.getFirstDead();
        projectile.reset(this.tabPerso[projectileInfo.id].x, this.tabPerso[projectileInfo.id].y);

        this.game.physics.arcade.moveToXY(projectile,projectileInfo.pointerX, projectileInfo.pointerY,300);
        this.game.time.events.add(750, function () {
            projectile.kill();
        }, this);
    },
    // =====================================
    // ==== UPDATE
    // =====================================
    /**
     * Fonction exécutée environ 60X / secondes
     */
    update: function () {
        //Permet de s'assurer qu'il est possible de jouer.
        if (this.peutCommencer) {
            //Empêche le joueur de traverser les murs
            this.game.physics.arcade.collide(this.perso, this.couches.murs);

            this.game.physics.arcade.collide(this.perso, this.drapeau, this.prendDrapeau, null, this);

            //A FAIRE *************************
            // Créer un groupe pour les personnages
            // Créer un groupe pour les projectiles
            // this.game.physics.arcade.overlap(projectilesEnnemis, tabEnnemis, detruirePersonnage, null, this);
            // Vérifier si ce sont nos propres balles et éviter de mourir
            // Sinon détruire et respawn le personnage
            // Déposer le drapeau s'il le faut.

            //Vérifie si le joueur entre dans sa base.
            if (this.map.getTileWorldXY(this.perso.position.x, this.perso.position.y, this.map.tileWidth, this.map.tileHeight, this.couches.base) && !this.dansSaBase) {
                this.dansSaBase = true;
                this.toucheBase();
            }
            //Vérifie si le joueur sort de la base
            if (this.map.getTileWorldXY(this.perso.position.x, this.perso.position.y, this.map.tileWidth, this.map.tileHeight, this.couches.base) === null && this.dansSaBase) {
                this.dansSaBase = false;
            };

            // Gestion du tir
            if (this.game.input.activePointer.isDown) {
                this.tirProjectile(this.game.input.activePointer.x, this.game.input.activePointer.y);
            }

            //Gestion des déplacements du joueur
            this.perso.body.velocity.x = 0;
            this.perso.body.velocity.y = 0;
            let sens = 1;

            //Détection des touches 
            if (this.fleches.left.isDown) {
                this.perso.scale.x = -1;
                this.perso.animations.play('marcheCote', 30, true);
                this.perso.body.velocity.x = -350;

                //On transmet la nouvelle position au script du client
                JOUEUR.majPosition(JOUEUR.drapeauID, this.perso.position.x, this.perso.position.y, this.perso.frame, this.perso.scale.x);
            } else if (this.fleches.right.isDown) {
                this.perso.scale.x = 1;
                this.perso.animations.play('marcheCote', 30, true);
                this.perso.body.velocity.x = 350;

                //On transmet la nouvelle position au script du client
                JOUEUR.majPosition(JOUEUR.drapeauID, this.perso.position.x, this.perso.position.y, this.perso.frame, this.perso.scale.x);
            } else if (this.fleches.up.isDown) {
                this.perso.animations.play('marcheHaut', 30, true);
                this.perso.body.velocity.y = -350;

                //On transmet la nouvelle position au script du client
                JOUEUR.majPosition(JOUEUR.drapeauID, this.perso.position.x, this.perso.position.y, this.perso.frame, this.perso.scale.x);
            } else if (this.fleches.down.isDown) {
                this.perso.animations.play('marcheBas', 30, true);
                this.perso.body.velocity.y = 350;

                //On transmet la nouvelle position au script du client
                JOUEUR.majPosition(JOUEUR.drapeauID, this.perso.position.x, this.perso.position.y, this.perso.frame, this.perso.scale.x);
            } else {
                //Arrête l'animation lorsque les touches ne sont pas appuyées
                this.perso.animations.stop();
            }

            //FONCTION DE DÉVELOPPEMENT TESTE LA RÉSURRECTION  d'un joueur
            if (this.game.input.keyboard.isDown(Phaser.KeyCode.ONE)) {
                this.revivre(JOUEUR.drapeauID);
            }

            if (this.game.input.keyboard.isDown(Phaser.KeyCode.TWO)) {
                if (this.perso.possedeDrapeau == true) {
                    this.deposeDrapeau();
                }
            }

            if (this.game.input.keyboard.isDown(Phaser.KeyCode.THREE)) {
                if(this.points == false){
                    this.points = true;
                    JOUEUR.demarrerPoints();
                }
            }
            //console.log(this.perso.x, this.perso.y)
        } //Fin if qui détecte le début de la partie
    } //Fin update
}; // Fin Jeu.prototype