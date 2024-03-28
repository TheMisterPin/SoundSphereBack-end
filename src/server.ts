import express from "express";
import userRoutes from "./routes/user.routes";
import songRoutes from "./routes/song.routes";
import genreRoutes from "./routes/genre.routes";
import artistRoutes from "./routes/artist.routes";
import playlistRoutes from "./routes/playlist.routes";
import albumRoutes from "./routes/album.routes";

const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);
app.use("/song", songRoutes);
app.use("/genre", genreRoutes);
app.use("/artist", artistRoutes);
app.use("/playlist", playlistRoutes) 
app.use("/album", albumRoutes)

app.get("/", (req, res) => {
    res.status(200).json({message:"SoundSphere backend api"})
})

export default app;
