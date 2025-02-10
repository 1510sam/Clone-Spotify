const PlaylistModel = require("../models/Playlist");
const SongModel = require("../models/Song");
const UserModel = require("../models/User");

const CreatePlaylistCtrl = async (req, res) => {
  try {
    const currentUser = req.user;
    const { name, thumbnail, songs } = req.body;
    const playlistData = {
      name,
      thumbnail,
      songs,
      owner: currentUser._id,
      collaborators: [],
    };
    const createPlaylist = await PlaylistModel.create(playlistData);
    if (!name || !thumbnail || !songs) {
      return res.status(400).json({ err: "Vui lòng nhập đủ trường dữ liệu." });
    }
    return res.status(200).json(createPlaylist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Internal Server Error" });
  }
};

const GetAllPlaylistCtrl = async (req, res) => {
  try {
    // Lấy tất cả playlist
    const playlists = await PlaylistModel.find({ owner: req.user._id });
    // Trả về response cho client
    return res.status(200).json({
      status: "OK",
      message: "Playlist fetched successfully",
      data: playlists,
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

const GetPlaylistCtrl = async (req, res) => {
  try {
    // Lấy playlist theo id
    const playlistId = req.params.playlistId;
    const playlist = await PlaylistModel.findOne({ _id: playlistId });
    if (!playlist) {
      return res.status(301).json({ err: "Vui lòng nhập đủ trường dữ liệu." });
    }
    // Trả về response cho client
    return res.status(200).json({
      status: "OK",
      message: "Playlist fetched successfully",
      data: playlist,
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

const GetPlaylistByArtist = async (req, res) => {
  const artistId = req.params.artistId;
  const artist = await UserModel.findOne({ _id: artistId });
  console.log(artist);

  if (!artist) {
    return res.status(301).json({ err: "Id ko hợp lệ." });
  }
  const playlists = await PlaylistModel.find({ owner: artistId });
  return res.status(200).json({
    status: "OK",
    message: "Playlist by artist fetched successfully",
    data: playlists,
  });
};

const addSongToPlaylistCtrl = async (req, res) => {
  const currentUser = req.user;
  const { playlistId, songId } = req.body;
  const playlist = await PlaylistModel.findOne({ _id: playlistId });
  if (!playlist) {
    return res.status(301).json({ err: "Playlist ko tồn tại." });
  }
  // Step 1: Kiểm tra xem CurrentUser có sở hữu danh sách phát hay là cộng tác viên?
  if (
    !playlist.owner.equals(currentUser._id) &&
    !playlist.collaborators.includes(currentUser._id)
  ) {
    return res.status(400).json({ err: "Not allowed" });
  }
  // Step 2: Kiểm tra song có hợp lệ ko
  const song = await SongModel.findOne({ _id: songId });
  if (!song) {
    return res.status(304).json({ err: "Song ko tồn tại." });
  }

  // Step 3: Thêm song vào db
  playlist.songs.push(songId);
  await playlist.save();

  return res.status(200).json(playlist);
};

module.exports = {
  CreatePlaylistCtrl,
  GetAllPlaylistCtrl,
  GetPlaylistCtrl,
  GetPlaylistByArtist,
  addSongToPlaylistCtrl,
};
