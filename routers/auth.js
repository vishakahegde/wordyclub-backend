const bcrypt = require("bcrypt");
const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const authMiddleware = require("../auth/middleware");
const User = require("../models/").user;
const { SALT_ROUNDS } = require("../config/constants");
require("dotenv").config();

const router = new Router();

const sgMail = require("@sendgrid/mail");

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide both email and password" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({
        message: "User with that email not found or password incorrect",
      });
    }

    delete user.dataValues["password"]; // don't send back the password hash
    const token = toJWT({ userId: user.id });
    return res.status(200).send({ token, ...user.dataValues });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password, name, public } = req.body;

  if (!email || !password || !name || public === undefined) {
    return res
      .status(400)
      .send("Please provide an email, password, name and public value");
  }

  try {
    const newUser = await User.create({
      email,
      password: bcrypt.hashSync(password, SALT_ROUNDS),
      name,
      public,
    });

    delete newUser.dataValues["password"]; // don't send back the password hash

    const token = toJWT({ userId: newUser.id });

    res.status(201).json({ token, ...newUser.dataValues });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .send({ message: "There is an existing account with this email" });
    }
    console.log(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

// The /me endpoint can be used to:
// - get the users email & name using only their token
// - checking if a token is (still) valid
router.get("/me", authMiddleware, async (req, res) => {
  // don't send back the password hash
  delete req.user.dataValues["password"];
  res.status(200).send({ ...req.user.dataValues });
});

router.patch("/changepassword", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!bcrypt.compareSync(oldPassword, req.user.password)) {
      return res.status(400).send({
        message: "Incorrect old password",
      });
    }

    await User.update(
      { password: bcrypt.hashSync(newPassword, SALT_ROUNDS) },
      {
        where: {
          id: req.user.id,
        },
      }
    );

    return res.status(200).send({
      message: "Password updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
});

router.patch("/resetpassword", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send({
        message: "User with that email not found",
      });
    }
    const emailSplit = user.email.split("@");
    const newPassword = emailSplit[0].concat("1234");
    await User.update(
      { password: bcrypt.hashSync(newPassword, SALT_ROUNDS) },
      {
        where: {
          id: user.id,
        },
      }
    );

    sgMail.setApiKey(process.env.SENDGRID_APIKEY);
    const msg = {
      to: user.email,

      from: process.env.FROM_EMAIL,
      subject: `Password reset`,

      html: `<h2>Hi There!</h2>
      <p> Your new password for wordyclub is <strong><i><u>${newPassword}</u></i></strong></p>
      <br/>
      <p>Warm Regards,</p>
      <p>Wordy Club</p>`,
    };
    sgMail
      .send(msg)
      .then(() => {})
      .catch((error) => {});
    return res.status(200).send({
      message: "Password Request successfull",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
});

module.exports = router;
