import { sendEmail } from '../Javascript/sendEmailFunction.js';

document.getElementById('btn-confirmation').addEventListener('click', function (event) {
    event.preventDefault();

    const form = document.forms['rentalForm'];
    const nom = form['nom'].value.trim();
    const prenom = form['prenom'].value.trim();
    const email = form['email'].value.trim();

    if (nom && prenom && email && tel && dateDebut && duree && idVoiture) {
        alert(`Merci ${prenom} ${nom} !\nVotre réservation est confirmée`);
        sendEmail(email, prenom, nom); // Call sendEmail with relevant data
    } else {
        alert('Veuillez remplir tous les champs.');
    }
});