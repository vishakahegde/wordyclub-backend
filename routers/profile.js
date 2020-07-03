const { Router } = require("express");
const authMiddleware = require("../auth/middleware");

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
  delete userProfile.dataValues["password"]; // don't send back the password hash
  res.status(200).send({ message: "ok", userProfile });
});

router.patch("/:userId", authMiddleware, async (req, res) => {
  const user = await User.findByPk(req.params.userId, {
    include: [SearchHistory, FavouriteWord],
  });
  if (!user.id === req.user.id) {
    return res
      .status(403)
      .send({ message: "You are not authorized to update this homepage" });
  }

  const { name, email } = req.body;

  const updatedProfile = await user.update({
    name,
    email,
  });

  return res.status(200).send({ updatedProfile });
});

module.exports = router;
