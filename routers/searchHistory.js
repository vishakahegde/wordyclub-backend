const { Router } = require("express");
const SearchHistory = require("../models/").searchHistory;
const User = require("../models").user;
const authMiddleware = require("../auth/middleware");

const router = new Router();

router.get("/", async (req, res, next) => {
  try {
    const searchWords = await SearchHistory.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send(searchWords);
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (isNaN(parseInt(userId))) {
      res.status(400).send("User ID is not a number");
    }

    const user = await User.findByPk(userId);

    if (user === null) {
      return res.status(400).send("User does not exist");
    }

    const searchWords = await SearchHistory.findAll({
      where: { userId: userId },
      order: [["createdAt", "DESC"]],
    });

    if (searchWords === null) {
      res.status(404).send("No search history found for this User");
    }
    res.status(200).send(searchWords);
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { searchWord, userId } = req.body;
    console.log(userId);
    if (!searchWord) {
      return res.status(400).send("Please provide valid data");
    }
    if (userId) {
      if (isNaN(parseInt(userId))) {
        res.status(400).send("User ID is not a number");
      }

      const user = await User.findByPk(userId);

      if (user === null) {
        return res.status(400).send("User does not exist");
      }
      const word = await SearchHistory.create({ searchWord, userId });
      return res.status(200).send(word);
    } else {
      const word = await SearchHistory.create({ searchWord });
      return res.status(200).send(word);
    }
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

module.exports = router;
