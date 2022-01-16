const FormData = require("form-data");
const fetch = require("node-fetch");
const path = require("path");
const basePath = process.cwd();
const fs = require("fs");
// import dotenv
require("dotenv").config();

// const AUTH = "198adc16-5d25-450e-bf19-130b0880a38a";
const AUTH = process.env.NFTPORT_API_KEY;

// console.log("Uploading files to IPFS...", AUTH);

const TIMEOUT = 1000; // Milliseconds. Extend this if needed to wait for each upload. 1000 = 1 second.

const allMetadata = [];

async function uploadImagesToIPFS() {
  console.log("Uploading Files to IPFS via NFTPORT------------------");
  const files = fs.readdirSync(`${basePath}/build/images`);
  files.sort(function (a, b) {
    return a.split(".")[0] - b.split(".")[0];
  });
  for (const file of files) {
    const fileName = path.parse(file).name;
    console.log("FileName:", fileName);
    let jsonFile = fs.readFileSync(`${basePath}/build/json/${fileName}.json`);
    let metaData = JSON.parse(jsonFile);

    if (!metaData.file_url.includes("ipfs.io/ipfs/")) {
      const response = await fetchWithRetry(file);
      console.log("Response:", response);
      metaData.file_url = response.ipfs_url;

      fs.writeFileSync(
        `${basePath}/build/json/${fileName}.json`,
        JSON.stringify(metaData, null, 2)
      );
      console.log(`${response.file_name} uploaded & ${fileName}.json updated!`);
    } else {
      console.log(`${fileName} already uploaded.`);
    }

    allMetadata.push(metaData);
  }
  fs.writeFileSync(
    `${basePath}/build/json/_metadata.json`,
    JSON.stringify(allMetadata, null, 2)
  );

  console.log("All files uploaded! loops ENDS");
}

function timer(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function fetchWithRetry(file) {
  await timer(TIMEOUT);
  return new Promise((resolve, reject) => {
    const fetch_retry = (_file) => {
      const formData = new FormData();
      const fileStream = fs.createReadStream(
        `${basePath}/build/images/${_file}`
      );
      formData.append("file", fileStream);

      let url = "https://api.nftport.xyz/v0/files";
      let options = {
        method: "POST",
        headers: {
          Authorization: AUTH,
        },
        body: formData,
      };

      return fetch(url, options)
        .then(async (res) => {
          const status = res.status;

          if (status === 200) {
            return res.json();
          } else {
            console.error(`ERROR STATUS: ${status}`);
            console.log("Retrying");
            await timer(TIMEOUT);
            fetch_retry(_file);
          }
        })
        .then(async (json) => {
          if (json.response === "OK") {
            return resolve(json);
          } else {
            console.error(`NOK: ${json.error}`);
            console.log("Retrying");
            await timer(TIMEOUT);
            fetch_retry(_file);
          }
        })
        .catch(async (error) => {
          console.error(`CATCH ERROR: ${error}`);
          console.log("Retrying");
          await timer(TIMEOUT);
          fetch_retry(_file);
        });
    };
    return fetch_retry(file);
  });
}

// uploadImagesToIPFS();

module.exports = {
  uploadImagesToIPFS,
};
