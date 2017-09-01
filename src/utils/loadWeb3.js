import Web3 from "web3";

// const IS_DEBUG = true;

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