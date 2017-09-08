# Kiosk

Kiosk is a protocol for buying and selling products without a trusted third-party. It is built with smart contracts and will be deployed to the public Ethereum blockchain.

## Project Overview

The blockchain has the potential to transform how we exchange goods and services. Early projects have shown innovative approaches for how buy and trade items in a trustless way, but most rely on application-specific smart contracts that are difficult to upgrade and reuse.

Kiosk provides a framework for creating and exchanging on decentralized marketplaces. Its smart contracts are building blocks that can be reconfigured for many different products and markets.

## Quick Start

Download the project.
```
git clone https://github.com/kioskprotocol/kiosk.git
```

In the root directory, install project dependencies.

```
yarn install
```

In a separate terminal tab, start TestRPC.

```
testrpc
```

Compile and deploy the Solidity contracts using [Truffle](http://truffleframework.com/).

```
truffle compile
truffle migrate
```

Then, start the React project and open http://localhost:3000/ to see the app.

```
yarn start
```

## Contact Us

The best way to get in touch is to join our public [Slack channel](https://join.slack.com/t/kioskprotocol/shared_invite/MjI3NzAwMzMyMTYyLTE1MDI5MjYyNzItM2FiMjA1NWIxZg).
