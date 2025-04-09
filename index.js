require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/api.js");

const port = process.env.PORT;
const mongoDB_url = process.env.mongoDB;
const app = express();

mongoose.connect(mongoDB_url).then(()=> console.log("MongoDB connected..."));

app.use(cors());
app.use(express.json({ extended: false }));
app.use(express.urlencoded({extended: false}));
app.use("/", router);

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
