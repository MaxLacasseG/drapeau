const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const bodyParser = require('body-parser');
let temps;
//var cookieParser = require(); À implémenter
app.set('port', (process.env.PORT || 8081));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');


//=============================
//          ROUTES 
// ============================
app.get('/', function (req, res) {
    res.render('index', {nbJoueur: app.equipes});
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
    app.drapeau = {
        x: 600,
        y: 600,
        equipe: null
    };
    //Enregistre le nombre de personnes par équipe
    app.equipes = {
        1:0,
        2:0,
        3:0
    };
});
//Section de gestion des événements sockets
//Eve. lancée lors d'une connexion au serveur
app.idDernierJoueur = 0;
io.on('connection', function (socket) {
    //Assignation du drapeau
    //Gestion des nouveaux utilisateurs
    socket.on('nouveauJoueur', function (data) {
        socket.emit('assignerDrapeauPos', app.drapeau);
        socket.joueur = {
                id: app.idDernierJoueur++,
                x: attribuerPosition(600, 600),
                y: attribuerPosition(600, 600),
                nom:data.nom,
                equipe:data.equipe
            },
        //On augmente le nombre de joueurs par équipe
        app.equipes[data.equipe]++;    
        console.log("++ equipes:", app.equipes);  
            //console.log("nouveauJoueur:"+socket.joueur.id);
        socket.emit('assignerID', socket.joueur.id);
        socket.emit('recupererJoueurs', recupererJoueurs());
        socket.broadcast.emit('nouveauJoueur', socket.joueur);

        //Si un joueur change la position en X
        socket.on('majPosition', function (data) {
            socket.joueur.x = data.x;
            socket.joueur.y = data.y;
            socket.joueur.id = data.id;
            socket.broadcast.emit('deplacement', socket.joueur);
        });

        socket.on('attraperDrapeau', function(data){
            console.log('joueur '+ data.id +' a attrapé le drapeau');
            socket.emit('majDrapeau', data.id);
        })

        //Gestion de la deconnection 
        socket.on('disconnect', function () {
            app.equipes[socket.joueur.equipe]--;
            console.log("deconnection:" + socket.joueur.id);
            console.log("-- equipes:", app.equipes);
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

function finJeu() {

}