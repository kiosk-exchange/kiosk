import Web3 from "web3";
const Promise = require("bluebird");

export const getAccountsAsync = async web3 => {
  const addresses = await Promise.promisify(web3.eth.getAccounts)();
  return addresses;
}

export const getNetworkAsync = async web3 => {
  const network = await Promise.promisify(web3.version.getNetwork)();
  return network;
}

const numberBalance = (balance, web3) => {
  return web3.fromWei(balance, "ether").toNumber();
}

export const getKMTBalanceAsync = async (web3, KMT, account) => {
  const getBalance = Promise.promisify(KMT.balanceOf);
  const balance = await getBalance(account);
  const formattedBalance = numberBalance(balance, web3);
  return formattedBalance;
}

export const getETHBalanceAsync = async (web3, account) => {
  const getBalance = Promise.promisify(web3.eth.getBalance);
  const balance = await getBalance(account);
  const formattedBalance = numberBalance(balance, web3);
  return formattedBalance;
}

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
  return new Promise((resolve, reject) => {

    // Check for a local connection first
    const provider = new Web3.providers.HttpProvider("http://localhost:8545");
    const web3 = new Web3(provider);

    const results = {
      web3: web3
    }

    resolve(results)

    // web3.isConnected(connected => {
    //   if (connected === true) {
    //     if (IS_DEBUG) console.log("********** USING LOCAL WEB3");
    //     const results = {
    //       web3: web3
    //     };
    //   } 
      // else {
      //   window.addEventListener("load", () => {
      //     let web3 = window.web3;

      //     // See if web3 has been injected by the browser (Mist, Parity, MetaMask)
      //     if (typeof web3 !== "undefined") {
      //       web3 = new Web3(web3.currentProvider);

      //       if (IS_DEBUG) console.log("********** USING INJECTED WEB3");
      //     } else {
      //       web3 = null;
      //       if (IS_DEBUG) console.log("********** NO WEB3");
      //     }

      //     const results = {
      //       web3: web3
      //     };

      //     resolve(results);
      //   });
      // }
    // });
  });
};