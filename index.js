const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const Album = require("./Album");

const port = process.env.PORT || 3000;
const uri = process.env.URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Music_Albums",
  })
  .then(() => console.log("MongoDB is connected"))
  .catch((error) => console.error("Error", error));

app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static("view"));

app.get("/albums", async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

app.put("/albums/:id", async (req, res) => {
  const id = req.params.id;
  if (albumById(id, res)) {
    const album = await albumById(id, res);
    console.log("id", req.body);

    try {
      album.title = req.body.title;
      album.artist = req.body.artist;
      album.year = req.body.year;
      const result = await album.save();
      res.json(result);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
});

app.delete("/albums/:id", async (req, res) => {
  const id = req.params.id;
  if (albumById(id, res)) {
    const album = await albumById(id, res);
    try {
      await album.deleteOne();
      res.json({ message: " Successfull" });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
});

app.post("/albums", async (req, res) => {
  try {
    const newAlbum = {
      title: req.body.title,
      artist: req.body.artist,
      year: req.body.year,
    };
    const albums = await Album.find(newAlbum).exec();
    if (albums.length > 0) {
      res.status(409).json({ message: "Inserted" });
      return;
    }

    let newId = await generateID();

    const album = new Album({
      id: newId,
      ...newAlbum,
    });

    try {
      const a1 = await album.save();
      console.log(a1);
      res.status(201).json([a1]);
    } catch (err) {
      res.sendStatus(400);
      return;
    }
  } catch (error) {
    console.log("Error", error);
  }
});

async function generateID() {
  let album = await Album.find({}).sort({ _id: -1 }).limit(1);
  const lastID = album[0].id + 1;
  return lastID;
}

async function albumById(id, res) {
  let album = await Album.find({ id: id }).exec();
  console.log("Album id", album[0]);
  if (album.length === 0) {
    return res.status(404).send("Error");
  }
  album = album[0];
  return album;
}

app.listen(port, console.log(" App running on http://localhost:" + port));
