const express  =require("express")
const cors = require("cors")

const app = express();
const {router} = require("./src/route")


app.use(cors({
  origin: 'http://localhost:8081',  // ← l'adresse de ton app Expo
  credentials: true,                // ← important pour les sessions
}));


app.use(express.json());
app.use("/",router);


app.listen(3000,"0.0.0.0", () => {
  console.log('Server is running on port 3000');
});