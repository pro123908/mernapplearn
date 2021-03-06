// Importing all the stuff from node modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

// Getting all the routes for the server
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

// Initializing App
const app = express();

// Setting up bodyparser for accessing request.body object
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuring Mongo database by mongoURI
const db = require("./config/keys").mongoURI;

// Connecting to Mongo Server at mlab
mongoose
  .connect(
    db,
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Setting up / route for the server
app.get("/", (req, res) => res.send("Hello"));

//Passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport.js")(passport);

//Secondary routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//Setting up port for the app
const port = process.env.PORT || 5000;

//Listening on the set port
app.listen(port, () => console.log(`Server running on port ${port}`));
