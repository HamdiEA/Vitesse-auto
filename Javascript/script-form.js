function sendMail(){
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
                document.location = "http://localhost:8000/html/index.html";
            },
            function(error) {
                alert("Erreur lors de l'envoi du message : " + error);
            }
        );
}