require("dotenv").config();

const express = require("express");
const cors = require("cors");
const router = require("./routes/api.js")

const port  = process.env.PORT;
const app = express();

app.use(cors());
app.use("/", router);

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
