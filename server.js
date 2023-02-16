const fs = require("fs");
const path = require("path");
const express = require("express");
const notes = require("./db/db.json");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Route for static index page
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// Route for static notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// Route for showing notes
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// Route for posting notes
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (req.body) {
    const newNote = {
      title: title,
      text: text,
      id: uuidv4(),
    };

    fs.readFile("db/db.json", "utf8", (error, data) => {
      if (error) {
        console.error(error);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(newNote);
        fs.writeFile(
          "db/db.json",
          JSON.stringify(parsedData, null, 2),
          (error) => {
            if (error) {
              console.log(error);
            }
          }
        );
        res.json(notes);
      }
    });
  }
});

// Route for deleting notes
app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  const deleteNote = notes.findIndex((note) => note.id == id);
  notes.splice(deleteNote, 1);
  return res.send();
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}.`)
);
