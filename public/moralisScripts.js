const serverUrl = "https://8944rp8ozh1s.usemoralis.com:2053/server";
const appId = "IbbkYoqklBSg31AiFANVm0U5GGUOQKBLV0I24OZH";
Moralis.start({ serverUrl, appId });
Moralis.enableWeb3();

console.log("Welcom to the abcdNFT");

let user;

// console.log("Current User", user);

const initApp = () => {
  console.log("Initiated App");
  user = Moralis.User.current();
  if (user) {
    console.log(user, "Alredy we have your data in our database");
    // document.getElementById("root").innerHTML =
    //   "Logged in as " + user.get("ethAddress");
    // showElement(navbar);
    // showElement(logoutBtn);
  } else {
    console.log("NOT LOGGED IN");
    // login();
    // hideElement(navbar);
    // hideElement(logoutBtn);
  }
};

// console.log(Moralis);

async function login() {
  if (!user) {
    try {
      user = await Moralis.authenticate({
        signingMessage: "lets login with abcdNFT",
      });
      initApp();
    } catch (error) {
      console.log(error);
    }
  } else {
    initApp();
  }
}

initApp();

const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24);
async function sell() {
  console.log("Selling...");
  for (let i = 1; i < 4; i++) {
    const res = await Moralis.Plugins.opensea.createSellOrder({
      network: "testnet",
      tokenAddress: "0x93eaca17140fe6c918ef55e5d5b40a0b1a458b0d",
      tokenId: i.toString(),
      tokenType: "ERC721",
      userAddress: "0xc77327f1851255b9f4da527cedb91c54499123ef",
      startAmount: 1,
      endAmount: 1,
    });
    console.log(res);
    console.log("SOld token", i);
  }

  console.log("Selling complete.");
}

async function getAssets(_tokenAddress, _tokenId) {
  const res = await Moralis.Plugins.opensea.getAsset({
    network: "testnet",
    tokenAddress: _tokenAddress,
    tokenId: _tokenId.toString(),
  });
  console.log(res);
}
