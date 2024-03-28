import { Response, Request } from "express";
import  prismaClient  from "../db/client";

export const getGenreById = async (req: Request, res: Response) => {
    const { genreId } = req.params
    try {
        const genre = await prismaClient.genre.findUnique({
            where: { id: genreId }
        })
        res.status(200).json(genre)
    } catch (error) {
        res.status(500).json({ error, message: "Can get genres" })
    }
}

export const createGenre = async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
        if (!name) throw new Error("Missing fields");

        const newGenre = await prismaClient.genre.create({ data: { name } })

        res.status(201).json(newGenre);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const updateGenre = async (req: Request, res: Response) => {
    const { genreId } = req.params
    const { name } = req.body
    try {
        const user = await prismaClient.genre.update({
            where: { id: genreId },
            data: { name: name },
        })
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const deleteGenre = async (req: Request, res: Response) => {
    const { genreId } = req.params

    try {

        await prismaClient.genre.delete({
            where: { id: genreId },
        })
        res.status(204).send("Genre deleted")
    } catch (error) {
        res.status(500).json(error)

    }
}

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
