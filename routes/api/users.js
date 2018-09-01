const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

// Importing the user model
const User = require("../../models/User");

//Users routes

// @route GET api/users/test
// @desc Test users route
// @access Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Users Works!"
  })
);

// @route POST api/users/register
// @desc Register User
// @access Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    // If user already exists with current email
    if (user) {
      return res.status(400).json({ email: "Email Already Exists!" });
    } else {
      // Registering the User
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default
      });

      // Creating the User
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar, // ES6, equivalent to avatar : avatar
        password: req.body.password
      });

      // Converting password plain string to hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          // Setting to password to its hash
          newUser.password = hash;
          //Saving new user to the database
          // Saved user will be returned
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc login and return JWT
// @access Public

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User not found!" });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        res.json({ msg: "Success" });
      } else {
        return res.status(400).json({ password: "Password Incorrect!" });
      }
    });
  });
});

module.exports = router;
