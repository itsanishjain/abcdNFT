const description =
  "This is the description of your NFT project, remember to replace this";
const baseUri = "https://hashlips/nft";


// ORIGINAL
const layersOrder = [
  { name: "Background" },
  { name: "Eyeball" },
  { name: "Eye color" },
  { name: "Iris" },
  { name: "Shine" },
  { name: "Bottom lid" },
  { name: "Top lid" },
];

// CHANGED

// const layersOrder = [
//   { name: "Background" },
//   { name: "Iris" },
//   { name: "Eye color" },
//   { name: "Top lid" },
//   { name: "Shine" } ,
//   { name: "Bottom lid" },
//   { name: "Eyeball" },
// ];



const format = {
  width: 512,
  height: 512,
};

const background = {
  generate: true,
  brightness: "80%",
};

const uniqueDnaTorrance = 10000;


// for how many arts you need to generate
// const editionSize = 3;

const editionSize = 5;

module.exports = {
  layersOrder,
  format,
  editionSize,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
};
