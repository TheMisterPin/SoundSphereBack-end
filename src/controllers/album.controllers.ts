import { Response, Request } from "express";
import  prismaClient from "../db/client";
import { getArtistById } from "./artist.controllers";

export const getAlbumById = async (req: Request, res: Response) => {
  const { albumId } = req.params;
  try {
    const album = await prismaClient.album.findUnique({
     where: { id: albumId },
      
      select: {
        id: true,
        name: true,
        thumbnail: true,
        Genre: {
          select: {
            id: true,
            name: true
          }
        },
        Artist: {
          select: {
            id: true,
            thumbnail: true,
            name: true,
          },
        },
        Song: {
          select: {
            id: true,
            name: true,
            url: true,
            thumbnail: true,
            isPublic: true,
            Artist: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(album);
  } catch (error) {
    res.status(500).json({ error, message: "Can get album" });
  }
};

export const createAlbum = async (req: Request, res: Response) => {
  const { name, thumbnail, artistId, genreId, isPublic } = req.body;
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!genreId) {
      return res.status(404).json({ message: "No GenreId" });
    }

    if (!thumbnail) {
      return res.status(404).json({ message: "No thumbnail" });
    }

    const newAlbum = await prismaClient.album.create({
      data: {
        name,
        thumbnail,
        UserCreator: { connect: { id: userId } },
        Genre: { connect: { id: genreId } },
        isPublic,
      },
    });

    res.status(201).json(newAlbum);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const updateAlbumById = async (req: Request, res: Response) => {
  const { albumId } = req.params;
  const { name, thumbnail, userCreatorId, artistId, genreId } = req.body;
  try {
    const user = await prismaClient.album.update({
      where: { id: albumId },
      data: {
        name: name,
        thumbnail: thumbnail,
        userCreatorId: userCreatorId,
        artistId: artistId,
        genreId: genreId,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteAlbumById = async (req: Request, res: Response) => {
  const { albumId } = req.params;

  try {
    await prismaClient.album.delete({
      where: { id: albumId },
    });
    res.status(204).send("Album deleted");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const genres = await prismaClient.genre.findMany({
      include: {
        Song: {
          take: 10,
          select: {
            id: true,
            name: true,
            url: true,
            duration: true,
            thumbnail: true,
            isPublic: true,
            artistId: true,
            albumId: true,
            genreId: true,

          },
        },
      },
    });
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getAllAlbums = async (req: Request, res: Response) => {
  try {
    const albums = await prismaClient.album.findMany({
      take: 23,
      select: {
        id: true,
        name: true,
        thumbnail: true,
        Genre: {
          select: {
            id: true,
            name: true}},
        Artist: {
          select: {
            id: true,
            thumbnail: true,
            name: true,
          },
        },
        Song: {
          select: {
            id: true,
            name: true,
            url: true,
            thumbnail: true,
            isPublic: true,
            Artist: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAlbumByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const albums = await prismaClient.album.findMany({
      where: {
        userCreatorId: userId,
      },
    });

    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json(error);
  }
}


export const getAlbumByArtistId = async (req: Request, res: Response) => {
  const { artistId } = req.params;
  try {
    const albums = await prismaClient.album.findMany({
      where: {
        artistId: artistId,
      },
    });

    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json(error);
  }
}



