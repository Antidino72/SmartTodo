const {betterAuth} = require("better-auth")
const { Pool } = require("pg")
require('dotenv').config();

const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
});