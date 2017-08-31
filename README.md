# Kiosk

Kiosk is a protocol for buying and selling products on the Ethereum blockchain.

## Project Overview

The blockchain has the potential to transform how we exchange goods and services. Early projects have shown innovative approaches for how buy and trade items in a trustless way. But most rely on application-specific smart contracts that are difficult to upgrade and reuse.

Kiosk provides a framework for creating decentralized marketplaces. Its smart contracts are building blocks that can be swapped in and out and reconfigured for many different markets.


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

## How It Works

![kiosk protocol](/kioskprotocol.jpg?raw=true)

The Kiosk protocol has four main components: `DIN`, `Market`, `Product`, and `Order`.

### DIN

A Decentralized Identification Number (DIN), is a unique, 10-digit product identifier. A client can look up a `DIN` on the global `DINRegistry` contract to find its corresponding `Market`.

### Market

A `Market` is an interface that buyers can use to purchase a product based on its `DIN`.

### Product

A `Product` tells a `Market` its price and availability.

### Order

An `Order` contains information about a purchase.

## Testing

```
truffle test
```

## Contact Us

The best way to get in touch is to join our public [Slack channel](https://join.slack.com/t/kioskprotocol/shared_invite/MjI3NzAwMzMyMTYyLTE1MDI5MjYyNzItM2FiMjA1NWIxZg).
