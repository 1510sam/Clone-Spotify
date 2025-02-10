const SongModel = require("../models/Song");
const UserModel = require("../models/User");

const CreateSongCtrl = async (req, res) => {
  try {
    const { name, thumbnail, track } = req.body;
    if (!name || !thumbnail || !track) {
      return res.status(400).json({ err: "Vui lòng nhập đủ trường dữ liệu." });
    }
    const artist = req.user._id;
    const songDetails = { name, thumbnail, track, artist };
    const createdSong = await SongModel.create(songDetails);
    return res.status(201).json(createdSong);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Internal Server Error" });
  }
};

const GetAllSongsCtrl = async (req, res) => {
  try {
    // Lấy tất cả bài hát của nghệ sĩ (artist)
    const songs = await SongModel.find({ artist: req.user._id });
    // Trả về response cho client
    return res.status(200).json({
      status: "OK",
      message: "Songs fetched successfully",
      data: songs,
    });
  } catch (e) {
    // Xử lý lỗi và trả về phản hồi lỗi
    return res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch songs",
      error: e.message,
    });
  }
};

const GetSongByArtist = async (req, res) => {
  const { artistId } = req.params;
  const artist = await UserModel.findOne({ _id: artistId });
  console.log(artist);
  if (!artist || artist.length == 0) {
    return res.status(301).json({ err: "Artist ko tồn tại" });
  }
  const song = await SongModel.findOne({ artist: artistId });
  return res.status(200).json({
    status: "OK",
    message: "Song by artist fetched successfully",
    data: song,
  });
};

const GetSongName = async (req, res) => {
  const { songName } = req.body;
  const songs = await SongModel.find({ name: songName });
  return res.status(200).json({
    status: "OK",
    message: "Song name fetched successfully",
    data: songs,
  });
};

module.exports = {
  CreateSongCtrl,
  GetAllSongsCtrl,
  GetSongByArtist,
  GetSongName,
};
