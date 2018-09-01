const jwtStrategy = require("passport-jwt").Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");

const opts = {};
// Getting the bearer token from header
opts.jwtFromRequest = extractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secret;

module.exports = passport => {
  passport.use(
    new jwtStrategy(opts, (jwtPayload, done) => {
      // Validating the user for protected routes
      User.findById(jwtPayload.id).then(user => {
        if (user) {
          return done(null, user); // Validated
        } else {
          return done(null, false); // False
        }
      });
    })
  );
};
