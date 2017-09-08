import Web3 from "web3";
const Promise = require("bluebird");
import { getNetwork } from "./network";

export const getAccountsAsync = async web3 => {
  const addresses = await Promise.promisify(web3.eth.getAccounts)();
  return addresses;
};

export const getNetworkAsync = async web3 => {
  const networkId = await Promise.promisify(web3.version.getNetwork)();
  const network = getNetwork(networkId);
  return network;
};

const numberBalance = (balance, web3) => {
  return web3.fromWei(balance, "ether").toNumber();
};

export const getKMTBalanceAsync = async (web3, KMT, account) => {
  const getBalance = Promise.promisify(KMT.balanceOf);
  const balance = await getBalance(account);
  const formattedBalance = numberBalance(balance, web3);
  return formattedBalance;
};

export const getETHBalanceAsync = async (web3, account) => {
  const getBalance = Promise.promisify(web3.eth.getBalance);
  const balance = await getBalance(account);
  const formattedBalance = numberBalance(balance, web3);
  return formattedBalance;
};

//   if (this.state.web3.version.network !== this.state.network.id) {
//   this.state.web3.version.getNetwork((error, result) => {
//     const network = getNetwork(result);
//     console.log("********** " + network.name.toUpperCase());
//     this.setState({ network: network });
//     // If it's a real network (not TestRPC), and not Kovan, log not supported error.
//     if (parseInt(network.id, 10) < 100 && network.id !== "42") {
//       this.setState({ error: ERROR.NETWORK_NOT_SUPPORTED });
//     }
//   });
// }
//

export const loadWeb3 = () => {
  return new Promise(async (resolve, reject) => {
    if (process.env.REACT_APP_TESTRPC) {
      const web3 = new Web3(
        new Web3.providers.HttpProvider("http://localhost:8545")
      );
      resolve(web3);
    } else {
      let web3 = window.web3;
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== "undefined") {
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);
        resolve(web3);
      } else {
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        web3 = new Web3(
          new Web3.providers.HttpProvider("http://localhost:8545")
        );

        // If we can get the latest block number without an error, resolve with web3
        const getBlockAsync = Promise.promisify(web3.eth.getBlockNumber);

        try {
          await getBlockAsync();
          resolve(web3)
        } catch (err) {
          resolve(null)
        }

      }
    }
  });
};