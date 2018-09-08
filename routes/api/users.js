const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// Importing the user model
const User = require("../../models/User");

const keys = require("../../config/keys");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

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
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    // If inputs were not valid, return status of 400 and errors array
    return res.status(400).json(errors);
  }

  // If valid, then try to save user to the database
  User.findOne({ email: req.body.email }).then(user => {
    // If user already exists with current email
    if (user) {
      return res.status(400).json({ email: "Email Already Exists!" });
    } else {
      // Registering the User
      // Getting his/her gravatar
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default
      });

      // Creating the User Object
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
          // Setting the password to its hash
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
  //Checking inputs
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    // If inputs were not valid
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Finding the user
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found!";
      return res.status(404).json(errors);
    }

    //If user is found then compare passwords
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // res.json({ msg: "Success" });
        //For initializing session for user
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };

        // Using JWT for authentication of user
        jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
          // A token will be assigned to the logged in user to authenticate user later
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        errors.password = "Password Incorrect!";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route POST api/users/current
// @desc return current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Payload will be in request object means current user details
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
