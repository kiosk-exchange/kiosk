import Web3 from "web3";

const IS_DEBUG = true;

let getWeb3 = new Promise((resolve, reject) => {
  window.addEventListener("load", () => {
    let web3 = window.web3;

    // See if web3 has been injected by the browser (Mist, Parity, MetaMask)
    if (typeof web3 !== "undefined") {
      web3 = new Web3(web3.currentProvider);

      if (IS_DEBUG) console.log("===== INJECTED WEB3 =====")
    } else {
      // Fallback to localhost if no web3 injection.
      const provider = new Web3.providers.HttpProvider("http://localhost:8545");
      web3 = new Web3(provider);

      if (web3.isConnected() === false) {
        web3 = null

        if (IS_DEBUG) console.log("===== NO WEB3 CONNECTION =====")
      } else {
        if (IS_DEBUG) console.log("===== LOCAL WEB3 =====")
      }

    }

    const results = {
      web3: web3,
    };

    resolve(results);

  });
});

export { getWeb3 };