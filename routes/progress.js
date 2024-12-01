const express = require("express");
const router = express.Router();
const userDB = require("../database/user");

router.post("/loadprogress", async (req, res) => {
  const { userId } = req.body;
  try {
    const result = await userDB.getAllProgress(userId);

    const progress = result.map((row) => ({
      level: row.level,
      high_score: row.high_score,
      level_complete: !!row.level_completed,
    }));

    console.log(JSON.stringify(progress));
    res.status(201).send({ progress });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "No Progress Found" });
  }
});

router.post("/saveprogress", async (req, res) => {
  const { userId, level, high_score, level_completed } = req.body;

  try {
    await userDB.saveOrUpdateProgress(
      userId,
      level,
      high_score,
      level_completed
    );
    res.status(200).send({ message: "Progress saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error saving progress" });
  }
});

router.get("/highscores/:level", async (req, res) => {
  const { level } = req.params;

  try {
    const highscores = await userDB.getHighScores(level);
    res.status(200).send({ highscores });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching high scores" });
  }
});

module.exports = router;