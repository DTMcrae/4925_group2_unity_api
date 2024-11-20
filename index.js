const express = require("express");
const bcrypt = require("bcrypt");
const { createUser, getUser } = require("./database/user");

const app = express();
const port = 3030;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Route to create a new user
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await getUser(username);
    if (existingUser) {
      return res.status(400).send({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const userId = await createUser(username, hashedPassword);

    // Respond with the new user's ID and username
    res.status(201).send({ userId, username });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error signing up" });
  }
});

// Route to login a user
app.post("/login", async (req, res) => {
    console.log("Received request");
  const { username, password } = req.body;

  try {
    console.log("Calling Function");
    const user = await getUser(username);
    console.log("Received response");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send({ message: "Invalid password" });
    }

    res.send({ userId: user.user_id, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error logging in" });
  }
});

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
