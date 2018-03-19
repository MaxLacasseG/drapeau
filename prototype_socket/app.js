const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const bodyParser = require('body-parser');
let temps;
let compteur, points;
//var cookieParser = require(); À implémenter
app.set('port', (process.env.PORT || 8081));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.set('view engine', 'ejs');


//=============================
//          ROUTES 
// ============================
//Accueil
app.get('/', function (req, res) {
    res.render('index', {
        nbJoueur: app.equipes
    });
});

// DÉMARRAGE DU JEU
app.post('/jeu', function (req, res) {
    data = {
        equipe: req.body.equipe,
        nom: req.body.nom
    };
    res.render('jeu', {
        data: data
    });
});

// =========================
// DÉMARRAGE DU SERVEUR
//==========================
server.listen(app.get('port'), function () {
    console.log('Listening on ' + server.address().port);
    const temps = process.hrtime();
    //Enregistre les infos du drapeau;
    app.positionsDrapeau = [{
        x: 165,
        y: 70
    }, {
        x: 395,
        y: 640
    }, {
        x: 1365,
        y: 150
    }, {
        x: 1410,
        y: 550
    }, {
        x: 850,
        y: 1105
    }, {
        x: 460,
        y: 1510
    }, {
        x: 505,
        y: 1250
    }];
    app.drapeau = {};
    posAleatoireDrapeau();

    //console.log(app.drapeau.posX, app.drapeau.posY);
    //Enregistre le nombre de personnes par équipe
    app.equipes = {
        1: {
            membres: 0,
            points: 0
        },
        2: {
            membres: 0,
            points: 0
        },
        3: {
            membres: 0,
            points: 0
        }
    };
});


//Section de gestion des événements sockets
//Eve. lancée lors d'une connexion au serveur
app.idDernierJoueur = 0;

io.on('connection', function (socket) {
    //Assignation du drapeau
    //Gestion des nouveaux utilisateurs
    socket.on('nouveauJoueur', function (data) {
        //On place le drapeau pour la première fois
        socket.emit('placerDrapeau', app.drapeau);
        socket.joueur = {
                id: app.idDernierJoueur++,
                x: attribuerPosition(600, 600),
                y: attribuerPosition(600, 600),
                nom: data.nom,
                equipe: data.equipe,
                possedeDrapeau:false
            },

            io.emit('afficherMessage', {
                auteur: socket.joueur.nom + " ",
                msg: " a rejoint la partie."
            })
        //On augmente le nombre de joueurs par équipe
        app.equipes[data.equipe].membres++;
        //console.log("++ equipes:", app.equipes);

        socket.emit('assignerID', socket.joueur.id);
        socket.emit('recupererJoueurs', recupererJoueurs());
        socket.broadcast.emit('nouveauJoueur', socket.joueur);
        
        //Si un joueur change la position en X
        socket.on('majPosition', function (data) {
            socket.joueur.x = data.x;
            socket.joueur.y = data.y;
            socket.joueur.id = data.id;
            socket.joueur.frame = data.frame;
            socket.joueur.sens = data.sens;
            socket.broadcast.emit('deplacement', socket.joueur);
        });

        // GESTION DRAPEAU
        //=================================
        socket.on('attraperDrapeau', function () {
            io.emit('afficherMessage', {
                auteur: socket.joueur.nom,
                msg: " s'est emparé(e) du drapeau!"
            });
            socket.joueur.possedeDrapeau = true;
            let tabJoueurs = recupererJoueurs();
            //console.log(tabJoueurs)
        });

        socket.on('echapperDrapeau', function (data) {
            io.emit('afficherMessage', {
                auteur: socket.joueur.nom,
                msg: " a échappé le drapeau!"
            });
        })

        socket.on('deposerDrapeau', function () {
            io.emit('afficherMessage', {
                auteur: socket.joueur.nom,
                msg: " a réussi à déposer le drapeau dans sa base!"
            });
            socket.joueur.possedeDrapeau = false;
        });

        

        socket.on('setDrapeau', function(data){
            app.drapeau = {
                posX: data.posX,
                posY: data.posY,
                visible:data.visible,
                equipe: data.equipe,
            };
            io.emit('placerDrapeau', app.drapeau);
        });

        socket.on('getDrapeau', function(data){
            socket.emit('placerDrapeau', app.drapeau);
        });

        // GESTION Projectiles
        //=================================
        socket.on('tirProjectile', function (data) {
            socket.broadcast.emit('syncProjectile', data);
        });

        socket.on('eliminerJoueur', function (data) {
            
            let tabJoueurs = recupererJoueurs();
            for(joueur of tabJoueurs){
                //console.log(tabJoueurs);
                if(joueur.id == data.id){
                    io.emit('afficherMessage', {
                        auteur: socket.joueur.nom,
                        msg: " a éliminé " + joueur.nom
                    });
                    
                    
                    if(joueur.possedeDrapeau == true){
                        //console.log('ok');
                        
                        app.drapeau = {
                            posX: data.posX,
                            posY: data.posY,
                            visible:true,
                            equipe: null
                        };
                        io.emit('placerDrapeau', app.drapeau);
                    }
                };
            }
            
            data.posX = attribuerPosition(600, 600);
            data.posY = attribuerPosition(600, 600);
            io.emit('replacerJoueur', data);
        });

        // GESTION points
        //=================================
        socket.on('augmenterPoints', function () {
            app.equipes[socket.joueur.equipe].points++;
            io.emit('majPoints', app.equipes);
            io.emit('afficherMessage', {
                auteur: "L'équipe " + socket.joueur.equipe,
                msg: " a fait un point!"
            });
            //demarrerCompteur();
            io.emit('afficherMessage', {
                auteur: "",
                msg: "Le drapeau est remis en jeu"
            });
            posAleatoireDrapeau();
        });

        socket.on('getPoints', function () {
            io.emit('majPoints', app.equipes);
            //demarrerCompteur();
        });


        //Gestion de la deconnection 
        socket.on('disconnect', function () {
            if(socket.joueur.possedeDrapeau){
                app.drapeau.posX = socket.joueur.x;
                app.drapeau.posY = socket.joueur.y;
                app.drapeau.visible = true;
                app.drapeau.equipe = null;
                io.emit('placerDrapeau', app.drapeau);
            }
            app.equipes[socket.joueur.equipe].membres--;
            //console.log("deconnection:" + socket.joueur.id);
            //console.log("-- equipes:", app.equipes);
            io.emit('afficherMessage', {
                auteur: socket.joueur.nom,
                msg: " a quitté la partie."
            });
            io.emit('enleverJoueur', socket.joueur.id);
        });
    });
});

function attribuerPosition(min, max) {
    var position = Math.floor((Math.random() * max) + min);
    return parseInt(position);
}

function recupererJoueurs() {
    var tabJoueurs = [];
    Object.keys(io.sockets.connected).forEach(function (socketID) {
        var joueur = io.sockets.connected[socketID].joueur;
        if (joueur) tabJoueurs.push(joueur);
    });
    return tabJoueurs;
}

function posAleatoireDrapeau() {
    var position = app.positionsDrapeau[Math.floor((Math.random() * app.positionsDrapeau.length))];
    app.drapeau.posX = position.x;
    app.drapeau.posY = position.y;
    app.drapeau.visible = true;
    app.drapeau.equipe = null;
    io.emit('placerDrapeau', app.drapeau);
}

function demarrerCompteur() {
    //console.log('démarrage temps');
    points = 0;
    compteur = setInterval(() => {
        points++;
        io.sockets.emit('ajouterPoints', {
            points: points
        })
    }, 1000);
    setTimeout(function () {
        clearInterval(compteur);
    }, 10500);
}

function arreterCompteur() {
    //console.log('arret')
    clearInterval(compteur);
}

function reinitialiserCompteur() {

}

function finJeu() {

}