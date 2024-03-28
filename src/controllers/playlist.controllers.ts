import { Response, Request } from "express";
import prismaClient from "../db/client";

export const getPlaylistById = async (req: Request, res: Response) => {
  const { playlistId } = req.params;
  try {
    const playlist = await prismaClient.playlist.findUnique({
      where: { id: playlistId },
    });
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ error, message: "Can get genres" });
  }
};

export const createPlaylist = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { playlistSongs, thumbnail, playlistName } = req.body;

  if (!userId) {
    return res.status(404).json({ message: "User not found" });
  }
  if (!playlistName) {
    return res.status(404).json({ message: "No PlaylistName" });
  }

  if (!thumbnail) {
    return res.status(404).json({ message: "No thumbnail" });
  }

  try {
    if (!playlistName) throw new Error("Missing fields");

    const newPlaylist = await prismaClient.playlist.create({
      data: {
        thumbnail,
        playlistName,
        UserCreator: { connect: { id: userId } },
        playlistSongs,
      },
      select: {
        id: true,
        userCreatorId: true,
        thumbnail: true,
        playlistName: true,
        playlistSongs: true,
      },
    });
    await prismaClient.user.update({
      where: { id: userId },
      data: { playlist: { connect: { id: newPlaylist.id } } },
    });

    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updatePlaylist = async (req: Request, res: Response) => {
  const { playlistId } = req.params;
  const { playlistName } = req.body;
  try {
    if (!playlistName) throw new Error("Missing fields");

    const newplaylist = await prismaClient.playlist.update({
      where: {
        id: playlistId,
      },
      data: { playlistName },
    });

    res.status(201).json(newplaylist);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deletePlaylist = async (req: Request, res: Response) => {
  const { playlistId } = req.params;

  try {
    await prismaClient.playlist.delete({
      where: { id: playlistId },
    });
    res.status(204).send("Playlist deleted");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllPlaylist = async (req: Request, res: Response) => {
  try {
    const playlist = await prismaClient.playlist.findMany();
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getPlaylistsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const playlists = await prismaClient.playlist.findMany({
      where: {
        userCreatorId: userId,
      },
    });

    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const addSongToPlayList = async (req: Request, res: Response) => {
  const { playlistId } = req.params;
  const { songId, thumbnail } = req.body;

  try {
    const existingPlaylist = await prismaClient.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!existingPlaylist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    if (existingPlaylist.playlistSongs.includes(songId)) {
      res
        .status(400)
        .json({ error: "This song already exists in the selected playlist" });
    }
    if (!existingPlaylist.playlistSongs.includes(songId)) {
      const updatedPlaylist = await prismaClient.playlist.update({
        where: {
          id: playlistId,
        },
        data: {
          playlistSongs: [songId, ...existingPlaylist.playlistSongs],
          thumbnail: thumbnail,
        },
      });
      res.status(200).json(updatedPlaylist);
    }
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    if (!res.headersSent) res.status(500).json(error);
  }
};

export const getSongsFromPlaylist = async (req: Request, res: Response) => {
  const { playlistId } = req.body;

  if (!playlistId) {
    return res
      .status(400)
      .json({ error: "Playlist ID is required in the request body" });
  }

  try {
    const existingPlaylist = await prismaClient.playlist.findUnique({
      where: { id: playlistId },
      select: {
        playlistSongs: true,
      },
    });

    if (!existingPlaylist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const songIds = existingPlaylist.playlistSongs;

    // Fetch song details for each song ID in the playlist
    const songs = [];

    for (const songId of songIds) {
      const song = await prismaClient.song.findUnique({
        where: {
          id: songId,
        },
      });

      if (song) {
        songs.push(song);
      }
    }

    return res.status(200).json({ songs });
  } catch (error) {
    console.error("Error retrieving songs from playlist:", error);
    if (!res.headersSent) return res.status(500).json(error);
  }
};
