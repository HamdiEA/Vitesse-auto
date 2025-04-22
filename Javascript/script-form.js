function sendMail(){
    parms = {
        nom : document.getElementById("nom").value,
        email : document.getElementById("email").value,
    }
    
    console.log(parms);

    emailjs.send("service_kagci7q", "template_5obibh4", parms)
    .then(function(response) {
        alert("Votre message a bien été envoyé !");
        // Since index.html is in the same folder as forum.html
        window.location.href = "index.html";
    })
    .catch(function(error) {
        alert("Erreur lors de l'envoi du message : " + error);
    });
}