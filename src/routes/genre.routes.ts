import { Router } from 'express'
import { createGenre, deleteGenre, getAllGenres, getGenreById, updateGenre } from '../controllers/genre.controllers'


const genreRoutes = Router()

genreRoutes.get("/", getAllGenres)
genreRoutes.get("/:genreId", getGenreById)
genreRoutes.post("/", createGenre)
genreRoutes.patch("/:genreId", updateGenre)
genreRoutes.delete("/:genreId", deleteGenre)


export default genreRoutes