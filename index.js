const express = require("express");
const authRoutes = require("./routes/auth");
const progressRoutes = require("./routes/progress");

const app = express();
const port = 3030;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/progress", progressRoutes);

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
