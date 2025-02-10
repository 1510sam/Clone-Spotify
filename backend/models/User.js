const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    private: true,
  },
  likedSongs: {
    type: String,
    default: "",
  },
  likedPlaylists: {
    type: String,
    default: "",
  },
  subcribedArtists: {
    type: String,
    default: "",
  },
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
