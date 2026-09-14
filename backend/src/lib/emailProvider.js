const nodemailer = require('nodemailer');
async function sendInvitationEmail(inviteLink,data) {
    let transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "759cffd79f6b4d",
            pass: "4d81b14862bbf9"
        }
    });
    console.log(inviteLink);
    transport.sendMail({
        from: "MonApplication <no-reply@example.com>",
        to: data.email,
        subject: `Invitation à rejoindre ${data.organization.name}`,
        html : `
        <h1>Vous êtes invité !</h1>

            <p>
              ${data.inviter.user.name} vous invite à rejoindre
              <strong>${data.organization.name}</strong> sur SmartTodo.
            </p>

            <a href="${inviteLink}">
              Accepter l'invitation
        </a>
        
        `
    }, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });
}
module.exports = {
    sendInvitationEmail
}