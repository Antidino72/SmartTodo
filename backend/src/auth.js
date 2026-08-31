const { betterAuth } = require("better-auth");
const { admin, organization } = require("better-auth/plugins"); // 🔑 Import propre depuis le package plugins
require('dotenv').config();
const database = require("./databaseProvider").database;

const auth = betterAuth({
  plugins: [
    admin(),
    organization()
  ],

  session: {
      cookieCache: {
        enabled: true,
        maxAge: 7 * 60 * 60 * 24 // 7 jours en secondes
      },
      expiresIn: 60 * 60 * 24 * 7, // 7 jours
      updateAge: 60 * 60 * 24 // 1 jour
  },
  advanced: {
    defaultCookieAttributes: {
      secure: false, // Passe à true en production (HTTPS)
      sameSite: 'lax',
      httpOnly: true,
    },
  },
  database: database,
  baseURL: "http://localhost:3000", // 🔑 Doit pointer vers ton serveur backend (port 3000)
  trustedOrigins: ["*"], // 🔑 Autorise ton app Expo Web à communiquer avec le backend
  emailAndPassword: { 
    enabled: true,
    autoSignIn: false 
  },
});

module.exports = { auth };