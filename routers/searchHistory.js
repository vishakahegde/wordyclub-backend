const { Router } = require("express");
const SearchHistory = require("../models/").searchHistory;
const User = require("../models").user;
const authMiddleware = require("../auth/middleware");
const { toData } = require("../auth/jwt");

const router = new Router();

router.get("/", async (req, res, next) => {
  const limit = req.query.limit || 30;
  const offset = req.query.offset || 0;
  try {
    const searchWords = await SearchHistory.findAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send(searchWords);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (isNaN(parseInt(userId))) {
      res.status(404).send("User ID is not a number");
    }

    const user = await User.findByPk(userId);

    if (user === null) {
      return res.status(404).send("User does not exist");
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
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

router.delete("/:userId", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    if (isNaN(parseInt(userId))) {
      res.status(404).send("User ID is not a number");
    }

    const user = await User.findByPk(userId);

    if (user === null) {
      return res.status(404).send("User does not exist");
    }

    await SearchHistory.destroy({
      where: { userId: userId },
    });
    res.status(200).send({ message: "Search history cleared" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { searchWord, token } = req.body;

    if (!searchWord) {
      return res.status(400).send("Please provide valid data");
    }
    if (token) {
      const data = toData(token);

      const user = await User.findByPk(data.userId);
      if (!user) {
        return res.status(404).send({ message: "User does not exist" });
      }

      const word = await SearchHistory.create({ searchWord, userId: user.id });
      return res.status(200).send(word);
    } else {
      const word = await SearchHistory.create({ searchWord });
      return res.status(200).send(word);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

module.exports = router;
