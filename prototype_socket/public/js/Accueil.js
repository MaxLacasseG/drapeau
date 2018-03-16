window.addEventListener("load", function(){
    let blocInstructions = document.querySelector('.instructionsConteneur');
    let btnInstructions = document.querySelector('.btnGroupe .instructions');

    btnInstructions.addEventListener('click', function(){
        blocInstructions.style.display = "flex";
    },false)

    blocInstructions.addEventListener('click', function(evt){
        blocInstructions.style.display = "none";
    },false)
},false);