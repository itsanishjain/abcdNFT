// write an express app
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// use dotenv
require("dotenv").config();

const { startCreating, buildSetup } = require("./src/main.js");

const { upload } = require("./uploadImages.js");
const { uploadImagesToIPFS } = require("./src/uploadFileIPFS.js");
const { uploadMetaToIPFS } = require("./src/uploadMetadataIPFS.js");

const { getNFT, getCollection } = require("./src/getnfts.js");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");

// set a view engine
app.set("view engine", "ejs");

// set a static folder
app.use(express.static(path.join(__dirname, "public")));

// set to expect json
app.use(express.json());
// set to expect urlencoded
app.use(express.urlencoded({ extended: true }));
// set to expect images
// app.use(express.static("public/images"));

// set to parse cookies
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("home", { message: "" });
});

// use to upload layers of images
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

  let newPath = "./layers/layer_" + layerNumber.toString();
  let oldPath = "./layers";

  if (fs.existsSync(newPath)) {
    fs.rmdirSync(newPath, { recursive: true });
  }
  fs.mkdirSync(newPath);

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

  // res.send("uploaded Layers" + layerNumber.toString());
  res.render("home", { message: `uploaded layer ${layerNumber.toString()}` });
});

// use to generate the final image using Hashlib engine
app.post("/generate", async (req, res) => {
  console.log("Generating...", req.body);
  buildSetup();
  startCreating(req.body.editionSize);
  console.log("Generated");
  res.render("home", { message: "Your art is generated" });
});

app.post("/upload-to-ipfs", async (req, res) => {
  console.log("uploading images and then metadata to ipfs");
  await uploadImagesToIPFS();
  await uploadMetaToIPFS();
  console.log("uploading DONE....");
  // res.send("uploaded images and metadata to ipfs");
  res.render("home", { message: "uploaded images and metadata to ipfs" });
});

app.get("/my-nfts", async (req, res) => {
  let collections = getCollection();
  res.render("my-nfts", { collections });

  // res.render("card");
});

// listen on port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Learnings from this project:

// How to upload multiple files in express
// points to remeber when you enctype="multipart/form-data"
// alway use the multer package and use the middleware to process it
// otherwise you will get othr form fields values in req.body
