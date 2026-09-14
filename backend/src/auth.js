const { betterAuth } = require("better-auth");
const { Resend } =  require("resend")
require("dotenv").config()
const resend = new Resend(process.env.RESEND_API_KEY)

const { admin, organization } = require("better-auth/plugins");
const {sendInvitationEmail} = require("./lib/emailProvider"); // 🔑 Import propre depuis le package plugins
require('dotenv').config();
const database = require("./databaseProvider").database;

const auth = betterAuth({
  plugins: [
    admin(),
    organization({
      async sendInvitationEmail(data) {
        const inviteLink =
            `${process.env.BETTER_AUTH_URL}/organization/invite/${data.id}`;

        sendInvitationEmail(inviteLink,data)
      },
    }),
  ],

  session: {
      cookieCache: {
        enabled: true,
        maxAge: 7 * 60 * 60 * 24
      },
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24
  },
  advanced: {
    defaultCookieAttributes: {
      secure: false,
      sameSite: 'lax',
      httpOnly: true,
    },
  },
  database: database,
  baseURL: "http://localhost:3000",
  trustedOrigins: ["*"],
  emailAndPassword: { 
    enabled: true,
    autoSignIn: false 
  },
});

module.exports = { auth };