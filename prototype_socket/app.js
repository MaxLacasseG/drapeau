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
    app.positionsDrapeau = [{x:165, y:70},{x:395, y:625},{x:1365, y:150},{x:1410, y:550},{x:850, y:1105},{x:460, y:1510},{x:505, y:1250}];
    let positionInitiale = app.positionsDrapeau[Math.floor(Math.random() * app.positionsDrapeau.length)];
    
    app.drapeau = {
        x: positionInitiale.x,
        y: positionInitiale.y,
        equipe: null,
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
        //On place le drapeau pour la première fois
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
        socket.on('attraperDrapeau', function(data){
            console.log('joueur '+ data.id +' a attrapé le drapeau. Il appartient à l\'equipe'+data.equipe);
            io.emit('drapeauEnDeplacement', data.id);
        })

        socket.on('deposerDrapeau', function(data){
            console.log('joueur '+ data.id +' a attrapé le drapeau. Il appartient à l\'equipe'+data.equipe);
            io.emit('drapeauEnDeplacement', data);
        })

         // GESTION Projectiles
        //=================================
        socket.on('tirProjectile', function(data){
            socket.broadcast.emit('syncProjectile', data);
        });

         // GESTION points
        //=================================
        socket.on('augmenterPoints', function(){
            demarrerCompteur();
        });


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

function demarrerCompteur(){
    console.log('démarrage temps');
    points = 0;
    compteur = setInterval(()=>{
        points++;
        io.sockets.emit('ajouterPoints', {points : points})
    },1000);
    setTimeout(function(){
        clearInterval(compteur);
    }, 10500);
}
function arreterCompteur(){
    console.log('arret')
    clearInterval(compteur);
}
function reinitialiserCompteur(){
    
}
function finJeu() {

}