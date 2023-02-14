// TODOs
// When I click on an existing note in the list in the left-hand column, then that note appears in the right-hand column
// When I click on the Write icon in the navigation at the top of the page, then I am presented with empty fields to enter a new note title and the note’s text in the right-hand column
// /api/notes/:id should receive a query parameter containing the id of a note to delete. In order to delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.

const fs = require("fs");
const path = require("path");
const express = require("express");
const notes = require("./db/db.json");

const app = express();
const PORT = 3001;

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
      title,
      text,
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
        res.json(parsedData);
      }
    });
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}.`)
);
