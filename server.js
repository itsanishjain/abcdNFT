// write an express app
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// use dotenv
require("dotenv").config();


const { startCreating, buildSetup } = require("./src/main.js");

const { upload } = require("./uploadImages.js");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");

// var multer = require("multer");
// var upload = multer();

// set a static folder
app.use(express.static("public"));

// set a view engine
app.set("view engine", "ejs");

// set to expect json
app.use(express.json());
// set to expect urlencoded
app.use(express.urlencoded({ extended: true }));
// set to expect images
app.use(express.static("public/images"));

// set to parse cookies
app.use(cookieParser());

// write a function to handle requests
app.get("/", (req, res) => {
  //   res.send("Hello World!");
  res.render("home");
});

app.post("/generate", async (req, res) => {
  console.log("Generating...", req.body);
  console.log(req.body.images);
  console.log(req.body.editionSize);
  //  ( () => {
  //   buildSetup();
  //   startCreating(3);
  // })();

  buildSetup();
  startCreating(3);
  console.log("Generated");

  res.send("Hello World!");
});

// let uploaeImagesDone = false;
// let layerNumber = 0;

app.post("/upload-layers", upload.array("images", 10), function (req, res) {
  let layerNumber;
  if (req.cookies.layerNumber) {
    console.log("COOKIE EXITS");
    layerNumber = Number(req.cookies.layerNumber) + 1;
    res.cookie("layerNumber", layerNumber);
  } else {
    console.log("COOKIE DOES NOT EXITS");
    res.cookie("layerNumber", 0);
    layerNumber = 0;
  }

  // read a cookie
//   console.log(req.cookies, "COOKIES");
  let newPath = "./pub/layer_" + layerNumber.toString();
  let oldPath = "./pub";
  fs.mkdirSync(newPath);
  //   fs.rename(oldPath, newPath, function (err) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log("DONE......");
  //     }
  //   });

  // moving files from pub to newPath
  fs.readdir(oldPath, (err, files) => {
    console.log(files.length, files);

    if (err) throw err;
    for (const file of files) {
      if (!file.includes("layer_")) {
        fs.rename(path.join(oldPath, file), path.join(newPath, file), (err) => {
          if (err) throw err;
          else console.log("DONE......");
        });
      }
    }
  });
  res.send("uploaded Layers" + layerNumber.toString());
});

// listen to the port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Learnings from this project:

// How to upload multiple files in express
// points to remeber when you enctype="multipart/form-data"
// alway use the multer package and use the middleware to process it
// otherwise you will get othr form fields values in req.body
