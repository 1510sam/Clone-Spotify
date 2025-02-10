const express = require("express");
const songCtrl = require("../controllers/songCtrl");
const router = express.Router();
const passport = require("passport");

// Thêm nhạc
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  songCtrl.CreateSongCtrl
);

// Xem danh sách nhạc
router.get(
  "/mySongs",
  passport.authenticate("jwt", {
    session: false,
  }),
  songCtrl.GetAllSongsCtrl
);

// Xem ds nhạc của nghệ sĩ
router.get(
  "/artist/:artistId",
  passport.authenticate("jwt", {
    session: false,
  }),
  songCtrl.GetSongByArtist
);

// Xem ds nhạc theo tên
router.get(
  "/get/songname",
  passport.authenticate("jwt", {
    session: false,
  }),
  songCtrl.GetSongName
);

module.exports = router;
