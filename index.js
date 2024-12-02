const express = require("express");
var cors = require("cors");
const authRoute = require("./routes/auth");
const progressRoute = require("./routes/progress");

const app = express();
const port = 3030;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  cors()
);

app.use("/auth", authRoute);
app.use("/progress", progressRoute);

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
