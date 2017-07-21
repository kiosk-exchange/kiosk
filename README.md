# Kiosk

Kiosk is an e-commerce platform built on Ethereum.

## Quick Start

The easiest way to get started is to test locally with [TestRPC](https://github.com/ethereumjs/testrpc)

```
$ testrpc
```

Compile and deploy the Solidity contracts using [Truffle](http://truffleframework.com/). This will also register a new Decentralized Identification Number (DIN) for the first testrpc account and add a product to the deployed `KioskResolver.sol` contract as specified in Truffle's `2_deploy_contracts.js`.

```
$ truffle compile
$ truffle migrate
```

Finally, start the React project and open http://localhost:3000/ to see the app.

```
$ yarn start
```
