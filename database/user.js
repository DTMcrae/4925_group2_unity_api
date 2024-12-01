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

async function getAllProgress(userid)
{
  try {
    const query = `
    SELECT * FROM game_progress WHERE user_id = :userid
    `;
    const [rows] = await database.execute(query, {userid});
    return rows;
  } catch(error) {
    //No progress found
    return [];
  }
}

async function saveOrUpdateProgress(userId, level, high_score, level_completed) {
  try {
    const query = `
      INSERT INTO game_progress (user_id, level, high_score, level_completed)
      VALUES (:userId, :level, :high_score, :level_completed)
      ON DUPLICATE KEY UPDATE
        high_score = GREATEST(high_score, :high_score),
        level_completed = :level_completed
    `;
    await database.execute(query, { userId, level, high_score, level_completed });
    return { success: true };
  } catch (error) {
    console.error("Error saving progress:", error.message);
    throw error;
  }
}

async function getHighScores(level) {
  try {
    const query = `
      SELECT u.username, gp.high_score
      FROM game_progress gp
      JOIN user u ON gp.user_id = u.user_id
      WHERE gp.level = :level
      ORDER BY gp.high_score DESC
    `;
    const [rows] = await database.execute(query, { level });
    return rows;
  } catch (error) {
    console.error("Error fetching high scores:", error.message);
    throw error;
  }
}


module.exports = { createUser, getUser, getAllProgress, getHighScores, saveOrUpdateProgress };
