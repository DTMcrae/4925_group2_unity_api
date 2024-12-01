const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const authRoute = require("./routes/auth");
const progressRoute = require("./routes/progress");

const app = express();
const port = 3030;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/auth", authRoute);
app.use("/progress", progressRoute);

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
