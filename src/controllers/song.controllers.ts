import { Response, Request } from "express";
import prismaClient from "../db/client";

export const getAllSongs = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 0; // Default to page 0
  const pageSize = 23;

  try {
    const songs = await prismaClient.song.findMany({
      where: {
        isPublic: true,
      },
      select: {
        id: true,
        name: true,
        url: true,
        thumbnail: true,
        Artist: {
          select: {
            name: true,
          },
        },
        Album: {
          select: {
            name: true, // Assuming you want the album's name
          },
        },
        Genre: {
          select: {
            name: true,
          },
        },
      },
      take: pageSize,
      skip: page * pageSize,
    });
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json(error);
  }
};


export const getSongById = async (req: Request, res: Response) => {
  const { songId } = req.params;

  try {
    const songs = await prismaClient.song.findUnique({
      where: {
        id: songId,
      },
    });

    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createSong = async (req: Request, res: Response) => {
  const { name, url, thumbnail, isPublic, genreId, albumId } = req.body;
  const { userId } = req.params;

  try {
    if (!name) {
      return res.status(404).json({ message: "Name not found" });
    }
    if (!url) {
      return res.status(404).json({ message: "No song url" });
    }

    if (!genreId) {
      return res.status(404).json({ message: "No genreId" });
    }

    if (!albumId) {
      return res.status(404).json({ message: "No albumId" });
    }

    const newSong = await prismaClient.song.create({
      data: {
        name,
        url,
        thumbnail,
        isPublic,
        UserCreator: { connect: { id: userId } },
        Genre: { connect: { id: genreId } },
        Album: { connect: { id: albumId } },
        Artist: { connect: { id: '65b238d4335a2dd9222300be' } },
      },
    });
    res.status(201).json(newSong);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

export const deleteSongById = async (req: Request, res: Response) => {
  const { songId } = req.params;

  try {
    const deletedSong = await prismaClient.song.delete({
      where: {
        id: songId,
      },
    });
    res.status(204).send("Song deleted: " + deletedSong);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateSongById = async (req: Request, res: Response) => {
  const { songId } = req.params;
  const { name, url, thumbnail, isPublic, genreId } = req.body;

  try {
    const updatedSong = await prismaClient.song.update({
      where: {
        id: songId,
      },
      data: {
        name,
        url,
        thumbnail,
        isPublic,
        genreId,
      },
    });
    res.status(201).json(updatedSong);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getSongsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const songs = await prismaClient.song.findMany({
      where: {
        userCreatorId: userId,
      },
    });

    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getPublicSongs = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 0; // Default to page 0
  const pageSize = 20;

  try {
    const songs = await prismaClient.song.findMany({
      where: {
        isPublic: true,
      },
      include: {
        Artist: {
          select: {
            name: true,
          },
        },
        Genre: {
          select: {
            name: true, 
          },
        },
      },
      take: pageSize,
      skip: page * pageSize,
    });
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getPublicSongsByGenre = async (req: Request, res: Response) => {
  try {
    const { genreId } = req.params;
    const song = await prismaClient.song.findMany({
      where: {
        isPublic: true,
        genreId: genreId,
      },
      take : 10,
      select: {
        id: true,
        name: true,
        url: true,
        thumbnail: true,
        Artist: {
          select: {
            name: true,
          },
        },
        Album: {
          select: {
            name: true,
          },
        },
        Genre: {
          select: {
            name: true,
          },
        },
      },
    });
    res.status(200).json(song);
  } catch (error) {
    res.status(500).json(error);
  }
};


export const getSongsByAlbumId = async (req: Request, res: Response) => {
  const { albumId } = req.params;
  try {
    const albumSongs = await prismaClient.song.findMany({
      where: {
       albumId: albumId,
      },
    });

    res.status(200).json(albumSongs);
  } catch (error) {
    res.status(500).json(error);
  }
}
