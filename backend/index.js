const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connnectToDb = require("./config/db");
const routes = require("./routes/route");
const bodyParser=require('body-parser');


const app = express();

connnectToDb();

app.use(cors());
 
// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.json());

app.use("/auth", routes);
app.use("/get",routes)
app.use('/user',routes);

app.listen(process.env.PORT, () =>
  console.log(`Server is running @PORT ${process.env.PORT}`)
);