import { Router } from "express";
import {
  addSongToPlayList,
  createPlaylist,
  deletePlaylist,
  getAllPlaylist,
  getPlaylistById,
  getPlaylistsByUserId,
  getSongsFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controllers";

const playlistRoutes = Router();
playlistRoutes.post("/getSongsByPlaylistId", getSongsFromPlaylist);
playlistRoutes.get("/", getAllPlaylist);
playlistRoutes.get("/:playlistId", getPlaylistById);

playlistRoutes.post("/create/:userId", createPlaylist);
playlistRoutes.patch("/:playlistId", updatePlaylist);
playlistRoutes.delete("/:playlistId", deletePlaylist);
playlistRoutes.post("/user/:userId", getPlaylistsByUserId);
playlistRoutes.patch("/addsong/:playlistId", addSongToPlayList);


export default playlistRoutes;
