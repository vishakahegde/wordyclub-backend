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
    const favourite = await FavouriteWord.findAll({
      where: { userId: userId },
      order: [["createdAt", "DESC"]],
    });
    if (favourite === null) {
      res.status(404).send("Favourite Word not found");
    }
    res.status(200).send(favourite);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { favouriteWord } = req.body;
    if (!favouriteWord) {
      return res.status(400).send("Please provide all input data");
    }
    console.log("User", req.user);
    const wordExists = await FavouriteWord.findOne({
      where: { favouriteWord: favouriteWord, userId: req.user.id },
    });
    if (wordExists) {
      return res
        .status(400)
        .send({ message: "Favourite Word already exists for this User" });
    }
    const word = await FavouriteWord.create({
      favouriteWord,
      userId: req.user.id,
    });
    res.status(200).send(word);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

router.delete("/", authMiddleware, async (req, res, next) => {
  try {
    const { favouriteWord } = req.body;
    if (!favouriteWord) {
      return res.status(400).send("Please provide all input data");
    }
    const word = await FavouriteWord.destroy({
      where: { favouriteWord: favouriteWord, userId: req.user.id },
    });
    // res.status(200).send(word);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

module.exports = router;
