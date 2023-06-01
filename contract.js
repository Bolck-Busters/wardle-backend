const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider("https://rpc.sepolia.dev")
);
const abi = require("./ABI.json");
const smartContract = new web3.eth.Contract(
  abi,
  "0x4Ff0c28bb08044cF583a3563D4013fB12bdFef1e"
);

let address;
web3.eth.getAccounts((err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(ass);
    address = data;
  }
});

module.exports = { smartContract, address };
