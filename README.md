# Kiosk

Kiosk is an e-commerce platform built on Ethereum.

## Quick Start

Get started by testing locally with [TestRPC](https://github.com/ethereumjs/testrpc).

```
$ testrpc
```

Compile and deploy the Solidity contracts using [Truffle](http://truffleframework.com/). This will also register a new Decentralized Identification Number (DIN) for the first testrpc account and add a demo product to the deployed `PublicProduct.sol`.

```
$ truffle compile
$ truffle migrate
```

Finally, start the React project and open http://localhost:3000/ to see the app.

```
$ yarn start
```
## Testing
```
truffle test
```
