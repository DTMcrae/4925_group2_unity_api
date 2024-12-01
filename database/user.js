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
    // Check if a row with the given user_id and level exists
    const checkQuery = `
      SELECT COUNT(*) AS count
      FROM game_progress
      WHERE user_id = :userId AND level = :level
    `;
    const [rows] = await database.execute(checkQuery, { userId, level });
    const exists = rows[0].count > 0;

    if (exists) {
      // If the row exists, update it
      const updateQuery = `
        UPDATE game_progress
        SET 
          high_score = GREATEST(high_score, :high_score),
          level_completed = :level_completed
        WHERE user_id = :userId AND level = :level
      `;
      await database.execute(updateQuery, { userId, level, high_score, level_completed });
    } else {
      // If the row does not exist, insert a new one
      const insertQuery = `
        INSERT INTO game_progress (user_id, level, high_score, level_completed)
        VALUES (:userId, :level, :high_score, :level_completed)
      `;
      await database.execute(insertQuery, { userId, level, high_score, level_completed });
    }

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
