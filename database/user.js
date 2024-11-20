const { database } = require("../databaseConnection");

// Function to create a new user
async function createUser(username, password) {
  try {
    const query = `
      INSERT INTO user (username, password)
      VALUES (:username, :password)
    `;
    const [result] = await database.execute(query, { username, password });
    return result.insertId; // Return the ID of the newly created user
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
}

// Function to get a user by username
async function getUser(username) {
  try {
    const query = `
      SELECT * FROM user WHERE username = :username
    `;
    const [rows] = await database.execute(query, { username });
    return rows[0]; // Return the first user (should be unique)
  } catch (error) {
    console.error("Error getting user:", error.message);
    throw error;
  }
}

module.exports = { createUser, getUser };
