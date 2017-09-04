var Transaction = require("ethereumjs-tx");
var Promise = require("bluebird");
var coder = require("web3/lib/solidity/coder");
var CryptoJS = require("crypto-js");
const ENSMarket = artifacts.require("ENS/ENSMarket.sol");

web3.eth = Promise.promisifyAll(web3.eth);

const encodeFunctionTxData = (functionName, types, args) => {
  var fullName = functionName + "(" + types.join() + ")";
  var signature = CryptoJS.SHA3(fullName, { outputLength: 256 })
    .toString(CryptoJS.enc.Hex)
    .slice(0, 8);
  var dataHex = "0x" + signature + coder.encodeParams(types, args);
  return dataHex;
};

var DIN = 1000000003;
var price = web3.toWei(50, "ether");
var data = encodeFunctionTxData("setPrice", ["uint256", "uint256"], [DIN, price]);

const createRawTransaction = async (account, privateKey) => {
  web3.eth.getBalanceAsync(account).then(async bal => {
    console.log("Balance: ", web3.fromWei(bal, "ether").toNumber().toFixed(3), "ETH");
    const nonce = await web3.eth.getTransactionCountAsync(account);
    console.log("Nonce: ", nonce);
    const tx = await new Transaction({
      to: "0xac2f3f20617e6e64068e1d78cbf1c686d1be06bf",
      value: 0,
      nonce: nonce,
      data: data,
      gasLimit: 2000000
    });
    await tx.sign(Buffer.from(privateKey, "hex"));
    const signedRawTx = await tx.serialize().toString("hex");
    console.log("Raw Transaction: ", signedRawTx, "\n");
  });
};

module.exports = callback => {
  const account = process.argv[4];
  const privKey = process.argv[5];

  if (!account || !privKey) {
    console.log(
      "USE: truffle exec ./scripts/raw_txn.js [account] [privateKey] \n"
    );
  } else {
    createRawTransaction(account, privKey)
  }
  callback();
};