import { Router } from "express";
import {
  createSong,
  deleteSongById,
  getAllSongs,
  getSongById,
  getPublicSongs,
  getSongsByUserId,
  updateSongById,
  getPublicSongsByGenre,
  getSongsByAlbumId,
} from "../controllers/song.controllers";

const songRoutes = Router();

songRoutes.get("/", getAllSongs)
songRoutes.get("/public", getPublicSongs);
songRoutes.get('/user/:userId', getSongsByUserId)
songRoutes.post('/:userId', createSong)
songRoutes.delete('/:songId', deleteSongById)
songRoutes.patch('/:songId', updateSongById)
songRoutes.get('/:songId', getSongById)
songRoutes.get("/public/genre/:genreId", getPublicSongsByGenre)
songRoutes.get("/getSongsByAlbumId/:albumId", getSongsByAlbumId)

export default songRoutes;
