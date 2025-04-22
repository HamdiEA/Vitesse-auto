function sendMail(event){
    parms = {
    nom : document.getElementById("nom").value,
    email : document.getElementById("email").value,
    }
    
    console.log(parms);
    
    emailjs.send("service_kagci7q", "template_5obibh4", parms)
    .then(
    function(_response) {
    console.log("SUCCESS!");
    alert("Votre message a bien été envoyé !");
    window.location.href = "/html/index.html"; },
    function(error) {
    alert("Erreur lors de l'envoi du message : " + error);
    }
    );
    }