import { Router } from 'express'
import { getAllAlbums, getAlbumById, createAlbum, updateAlbumById, deleteAlbumById, getAlbumByUserId, getAlbumByArtistId } from '../controllers/album.controllers'


const albumRoutes = Router()

albumRoutes.get("/", getAllAlbums)
albumRoutes.get("/:albumId", getAlbumById)
albumRoutes.post("/:userId", createAlbum)
albumRoutes.patch("/:albumId", updateAlbumById)
albumRoutes.delete("/:albumId", deleteAlbumById)
albumRoutes.get("/user/:userId", getAlbumByUserId)
albumRoutes.get("/getAlbumsByArtistId/:artistId", getAlbumByArtistId)


export default albumRoutes