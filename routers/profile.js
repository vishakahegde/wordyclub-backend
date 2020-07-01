const { Router } = require("express");

const User = require("../models").user;
const FavouriteWord = require("../models/").favouriteWord;
const SearchHistory = require("../models/").searchHistory;

const router = new Router();

router.get("/", async (req, res) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  const userProfiles = await User.findAndCountAll({
    limit,
    offset,
    include: [SearchHistory, FavouriteWord],
  });
  res.status(200).send({ message: "ok", userProfiles });
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  if (isNaN(parseInt(userId))) {
    return res.status(400).send({ message: "User id is not a number" });
  }

  const userProfile = await User.findByPk(userId, {
    include: [SearchHistory, FavouriteWord],
  });

  if (userProfile === null) {
    return res.status(404).send({ message: "userProfile not found" });
  }

  res.status(200).send({ message: "ok", userProfile });
});

module.exports = router;
