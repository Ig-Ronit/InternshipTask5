const express = require("express");
const path = require("path");
const fileupload = require("express-fileupload");
const fs = require("fs");

let initial_path = path.join(__dirname, "public");

const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(express.static(initial_path));
app.use(fileupload());

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(initial_path, "index.html"));
});

app.get("/editor", (req, res) => {
  res.sendFile(path.join(initial_path, "editor.html"));
});

// File upload route
app.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let file = req.files.image;
  let date = new Date();
  let imagename = date.getDate() + date.getTime() + file.name;
  let uploadPath = path.join(uploadDir, imagename);

  // Move file to the uploads folder
  file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(`uploads/${imagename}`);
  });
});

// Dynamic blog route
app.get("/:blog", (req, res) => {
  res.sendFile(path.join(initial_path, "blog.html"));
});

// Handle 404
app.use((req, res) => {
  res.status(404).json("404 - Page Not Found");
});

// Start server
app.listen(3000, () => {
  console.log("Server is listening on port 3000...");
});
