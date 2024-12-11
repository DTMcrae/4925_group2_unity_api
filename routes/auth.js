const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { createUser, getUser } = require("../database/user");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const schema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    password: Joi.string()
      .min(10)
      .max(20)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      .message(
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .required(),
  });

  const validationResult = schema.validate({ username, password });

  if (validationResult.error != null) {
    const errorMessage = validationResult.error.message;
    console.log(validationResult.error);
    return res.status(400).send({
      message: errorMessage,
    });
  }

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
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUser(username);
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

module.exports = router;