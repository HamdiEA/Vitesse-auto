document.getElementById('btn-confirmation').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent traditional form submission

    const form = document.forms['rentalForm'];
    const nom = form['nom'].value.trim();
    const prenom = form['prenom'].value.trim();
    const email = form['email'].value.trim();
    const tel = form['tel'].value.trim();
    const dateDebut = form['date_debut'].value.trim();
    const duree = form['duree'].value.trim();
    const idVoiture = form['id_voiture'].value.trim();

    if (nom && prenom && email && tel && dateDebut && duree && idVoiture) {
        alert(`Merci ${prenom} ${nom} !\nVotre réservation est confirmée\npour la voiture ID: ${idVoiture}`);
        sendEmail(email, prenom, nom, idVoiture); // Call sendEmail with relevant data
    } else {
        alert('Veuillez remplir tous les champs.');
    }
});

// Dynamically load the SMTP.js library
(function loadSMTPJs() {
    const script = document.createElement('script');
    script.src = "https://smtpjs.com/v3/smtp.js";
    document.head.appendChild(script);
})();

function sendEmail(email, prenom, nom, idVoiture) {
    if (!window.Email) {
        alert("SMTP.js library not loaded. Unable to send email.");
        return;
    }

    Email.send({
        Host: "smtp.your-email-provider.com", // Replace with your SMTP host
        Username: "your-email@example.com", // Replace with your email
        Password: "your-email-password", // Replace with your email password (use environment variables or secure storage)
        To: email,
        From: "your-email@example.com", // Replace with your email
        Subject: "Confirmation de réservation",
        Body: `Bonjour ${prenom} ${nom},<br><br>Votre réservation pour la voiture ID: ${idVoiture} a été confirmée.<br><br>Merci de nous faire confiance !`
    }).then(function () {
        alert("Email envoyé avec succès !");
    }).catch(function (error) {
        alert("Erreur lors de l'envoi de l'email : " + error);
    });
}