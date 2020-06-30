const { Router } = require("express");
const FavouriteWord = require("../models/").favouriteWord;
const authMiddleware = require("../auth/middleware");

const router = new Router();

router.get("/", async (req, res, next) => {
  try {
    const favouriteWords = await FavouriteWord.findAll();
    res.status(200).send(favouriteWords);
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (isNaN(parseInt(userId))) {
      res.status(400).send("Favourite Word ID is not a number");
    }
    const favourite = await FavouriteWord.findAll({
      where: { userId: userId },
    });
    if (favourite === null) {
      res.status(404).send("Favourite Word not found");
    }
    res.status(200).send(favourite);
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { favouriteWord, userId } = req.body;
    if (!favouriteWord || !userId) {
      return res.status(400).send("Please provide all input data");
    }
    const wordExists = await FavouriteWord.findOne({
      where: { favouriteWord: favouriteWord, userId: userId },
    });
    if (wordExists) {
      return res
        .status(400)
        .send({ message: "Favourite Word already exists for this User" });
    }
    const word = await FavouriteWord.create({
      favouriteWord,
      userId,
    });
    res.status(200).send(word);
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.delete("/", authMiddleware, async (req, res, next) => {
  try {
    const { favouriteWord, userId } = req.body;
    if (!favouriteWord || !userId) {
      return res.status(400).send("Please provide all input data");
    }
    const word = await FavouriteWord.destroy({
      where: { favouriteWord: favouriteWord, userId: userId },
    });
    // res.status(200).send(word);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

module.exports = router;
