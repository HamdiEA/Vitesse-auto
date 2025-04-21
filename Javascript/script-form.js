document.getElementById('btn-confirmation').addEventListener('click', function (event) {
    event.preventDefault();

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

