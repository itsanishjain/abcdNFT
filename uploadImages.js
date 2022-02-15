const fs = require("fs");
const multer = require("multer");

//Define where project photos will be stored
var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    if (fs.existsSync("./layers")) {
      callback(null, "./layers");
    }
    else{
      fs.mkdirSync("./layers");
      callback(null, "./layers");
    }
  },
  filename: function (request, file, callback) {
    // console.log(file);
    callback(null, file.originalname);
  },
});

// Function to upload project images
var upload = multer({ storage: storage });

module.exports = {
  upload,
};
