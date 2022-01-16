const fetch = require("node-fetch");

const AUTH = "198adc16-5d25-450e-bf19-130b0880a38a";
// const AUTH = process.env.NFTPORT_API_KEY;

const MINT_TO_ADDRESS = "0xc77327F1851255b9f4DA527CEDB91C54499123ef";

const data = {
  response: "OK",
  total: 3,
  minted_nfts: [
    {
      chain: "rinkeby",
      transaction_hash:
        "0x136a144dc4cb1b9a7a619fcf6aa6c18c946dffaf7d7aa706f486ecb7334b0368",
      contract_name: "RINK",
      contract_address: "0x93eaca17140fe6c918ef55e5d5b40a0b1a458b0d",
      token_id: "1",
      mint_to_address: "0xc77327f1851255b9f4da527cedb91c54499123ef",
      metadata_uri:
        "ipfs://bafkreibxd3hmzvcx5jmtumcmxfvdvrxi4tkvx7uxujq6l37dqcdihmfvwu",
      metadata_frozen: true,
      mint_date: "2022-01-16T08:14:46.209468",
    },
    {
      chain: "rinkeby",
      transaction_hash:
        "0x67f21a10d37d1642e20348b37de68edff6720635c65cab52d70020b24b0e8646",
      contract_name: "RINK",
      contract_address: "0x93eaca17140fe6c918ef55e5d5b40a0b1a458b0d",
      token_id: "2",
      mint_to_address: "0xc77327f1851255b9f4da527cedb91c54499123ef",
      metadata_uri:
        "ipfs://bafkreiegtvwjytug4kmoi6jlhkb4q7w3fhbmb5v4wc5k7al4lbpbnpdgja",
      metadata_frozen: true,
      mint_date: "2022-01-16T08:14:50.080117",
    },
    {
      chain: "rinkeby",
      transaction_hash:
        "0xacd63836d39033ec255faa9b8ebf234a189d5fbb5a4b7ba0be3c09025cb4e066",
      contract_name: "RINK",
      contract_address: "0x93eaca17140fe6c918ef55e5d5b40a0b1a458b0d",
      token_id: "3",
      mint_to_address: "0xc77327f1851255b9f4da527cedb91c54499123ef",
      metadata_uri:
        "ipfs://bafkreidhvjb5omw7axbo2bvtgiqu4lmkr4i72asmjhgo2keus2wmtaeghu",
      metadata_frozen: true,
      mint_date: "2022-01-16T08:14:53.970820",
    },
  ],
  error: null,
};

const getNFT = () => {
  let url = "https://api.nftport.xyz/v0/me/mints";
  let options = {
    method: "GET",
    qs: { chain: "polygon" },
    headers: {
      "Content-Type": "application/json",
      Authorization: AUTH,
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
    })
    .catch((err) => console.error("error:" + err));
};

function getCollection() {
  let collections = [];

  data.minted_nfts.map((item) => {
    // console.log(item)
    if (item.mint_to_address === MINT_TO_ADDRESS.toLocaleLowerCase()) {
      let contract_address = item.contract_address;
      if (collections.length === 0) {
        collections.push({
          contract_address: contract_address,
          minted_nfts: [item],
        });
      } else {
        let found = false;
        collections.map((collection) => {
          if (collection.contract_address === contract_address) {
            collection.minted_nfts.push(item);
            found = true;
          }
        });
        if (!found) {
          collections.push({
            contract_address: contract_address,
            minted_nfts: [item],
          });
        }
      }
    }
  });
  return collections;
}

function getNftMetadata() {
  fetch(
    "https://deep-index.moralis.io/api/v2/nft/0x93eaca17140fe6c918ef55e5d5b40a0b1a458b0d/metadata",
    {
      headers: {
        Accept: "application/json",
        "X-Api-Key":
          "zXnehlfWN1Y0IkCBFkFi0bDbCy36p9K7WD6Y1ro0qIOZTEHQAxfpregaxxpGjGSN",
      },
    }
  ).then((res)=>{
      return res.json();
  }).then((json)=>{
      console.log(json)
  })
}

console.log(getCollection());

// getNFT()
// getNftMetadata()

module.exports = {
  getNFT,
  getCollection,
};
