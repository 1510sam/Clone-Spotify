const express = require("express");
const playlistCtrl = require("../controllers/playlistCtrl");
const router = express.Router();
const passport = require("passport");

// Thêm playlist
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  playlistCtrl.CreatePlaylistCtrl
);

// Xem playlist theo id
router.get(
  "/:playlistId",
  passport.authenticate("jwt", {
    session: false,
  }),
  playlistCtrl.GetPlaylistCtrl
);

// Xem ds playlist theo mã nghệ sĩ
router.get(
  "/artist/:artistId",
  passport.authenticate("jwt", {
    session: false,
  }),
  playlistCtrl.GetPlaylistByArtist
);

// Xem ds nhạc theo tên
router.post(
  "/add/song",
  passport.authenticate("jwt", {
    session: false,
  }),
  playlistCtrl.addSongToPlaylistCtrl
);

module.exports = router;
