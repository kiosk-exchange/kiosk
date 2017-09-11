# Buying a Product

The easiest way to buy a product is through the user interface hosted at http://www.kioskprotocol.com/. The website is [open-source](https://github.com/kioskprotocol/kiosk) and simply reads and displays information that is stored on the blockchain.

To interact with the website, you must use Google Chrome with either the [MetaMask](https://metamask.io/) or [Parity](https://chrome.google.com/webstore/detail/parity-ethereum-integrati/himekenlppkgeaoeddcliojfddemadig) Chrome extension installed. If you're not a developer, we recommend using MetaMask because Parity requires that you run your own [Ethereum node](https://github.com/paritytech/parity/wiki/Basic-Usage). These extensions inject a [web3](https://github.com/ethereum/web3.js/) Javascript object into the browser, which Kiosk needs to read from and write to the blockchain. Web3 is the Javascript API for interacting with a blockchain that implements the Ethereum protocol.

While using the website is the simplest way to buy a product, it might be useful to try to use the Kiosk protocol directly for custom use cases or to solidify your understanding of how the blockchain works.

To do this, you need the [ABI](https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI) of the `Buy` smart contract and its address on the blockchain. The Kiosk protocol smart contracts are currently deployed to the [Kovan Test Network](https://kovan-testnet.github.io/website/). Its ABI and address on Kovan are below:

```
ABI: // TODO:
Address: 0xb309f6b255302c4e069c95072f4388e53bd981e4
```

// TODO: MyEtherWallet, Truffle, etc.

The point to get across here is that Kiosk is a *protocol* for buying products. In order to buy a product on Amazon, you need to go to https://www.amazon.com/. To buy a product with Kiosk, you can use any interface you choose as long as it lets you communicate with the blockchain. That is a fundamental shift from how the Internet currently works.
