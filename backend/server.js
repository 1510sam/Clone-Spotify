const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const UserModel = require("./models/User");
const authRoute = require("./routes/auth");
const songRoute = require("./routes/song");
const playlistRoute = require("./routes/playlist");

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "thisKeyIsSupposedToBeSecret";
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await UserModel.findOne({ _id: jwt_payload._id }); // Hoặc jwt_payload.identifier nếu đúng
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.BACKEND_URL || 9001;
const db = process.env.DB_URL;

app.use("/auth", authRoute);
app.use("/song", songRoute);
app.use("/playlist", playlistRoute);

mongoose
  .connect(db)
  .then(() => {
    console.log("Connected successfully");
  })
  .catch((err) => {
    console.log("error: " + err);
  });

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
