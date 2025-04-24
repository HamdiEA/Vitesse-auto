function sendMail() {
    const parms = {
      nom: document.getElementById("nom").value,
      email: document.getElementById("email").value,
      modelName: document.getElementById("model").value,
    };
  
    console.log(parms);
  
    emailjs.send("service_kagci7q", "template_5obibh4", parms)
      .then(async () => {
        alert("Votre message a bien été envoyé !");
        window.location.href = "/html/index.html";
        await fetch(`/api/cars/unavailable=${encodeURIComponent(modelName)}`);
      })
      .catch((error) => {
        alert("Erreur lors de l'envoi du message : " + error);
      });
  }
  