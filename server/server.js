const express = require("express"); 

const app = express(); 

const cors = require("cors"); 

const mongoose = require("mongoose");

require("dotenv").config();

const bcrypt = require("bcrypt");

const port = process.env.PORT || 3002;

const Router = require("../server/routes/routes");

const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(cookieParser())

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
  })
);


app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send('Something went wrong!')
})



Router(app);

app.listen(port, () => {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connected to Database");
  });

  console.log(`Server is running on port: ${port} `);
});