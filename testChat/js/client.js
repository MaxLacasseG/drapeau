"use strict"

//Objet client enregistré en global
var Client = {}

//Envoie un message au serveur et créé une connexion socket
Client.socket = io.connect();

Client.envoyerMsg = function(utiltxt, msgtxt){
    Client.socket.emit('nouveauMsg', {util:utiltxt, msg:msgtxt});
};

Client.socket.on('afficherMsg', function(data){
    afficherMsg(data.util, data.msg);
});
