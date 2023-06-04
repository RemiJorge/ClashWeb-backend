function passwordForgetTemplate  (pseudo, newPassword){
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
    </head>
    <body>
        <p>Bonjour ${pseudo},</p>
        <p>Voici votre nouveau mot de passe : <strong>${newPassword}</strong></p>
        <p>Merci de bien vouloir vous connecter avec ce nouveau mot de passe.</p>
        <p>Cordialement,</p>
        <p>Votre équipe de développement</p>
    </body>
    </html>`
};

module.exports = passwordForgetTemplate;
