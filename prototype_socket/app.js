var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
//var cookieParser = require(); À implémenter
app.set('port', (process.env.PORT || 8081));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/jeu', function (req, res) {
    data = {
        equipe: req.body.equipe,
        nom: req.body.nom
    };
    res.render('jeu', {
        data: data
    });
});

server.listen(app.get('port'), function () { // Listens to port 8081
    console.log('Listening on ' + server.address().port);
    app.drapeau = {
        x: 10,
        y: 10,
        equipe: null
    }
});

//Section de gestion des événements sockets
//Eve. lancée lors d'une connexion au serveur
app.idDernierJoueur = 0;
io.on('connection', function (socket) {
    //Assignation du drapeau
    //Gestion des nouveaux utilisateurs
    socket.on('nouveauJoueur', function () {
        socket.emit('assignerDrapeauPos', app.drapeau);
        socket.joueur = {
                id: app.idDernierJoueur++,
                x: attribuerPosition(600, 600),
                y: attribuerPosition(600, 600)
            },
            //console.log("nouveauJoueur:"+socket.joueur.id);
            socket.emit('assignerID', socket.joueur.id);
        socket.emit('recupererJoueurs', recupererJoueurs());
        socket.broadcast.emit('nouveauJoueur', socket.joueur);

        //Si un joueur change la position en X
        socket.on('majPosition', function (data) {
            //console.log('deplacement:' + data.id);
            socket.joueur.x = data.x;
            socket.joueur.y = data.y;
            socket.joueur.id = data.id;
            socket.broadcast.emit('deplacement', socket.joueur);
        });


        //Gestion de la deconnection 
        socket.on('disconnect', function () {
            console.log("deconnection:" + socket.joueur.id);
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