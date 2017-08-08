# Kiosk

Kiosk is a protocol for buying and selling products on the Ethereum blockchain.

## Project Overview

The blockchain has the potential to transform how we exchange goods and services. Early projects have shown innovative approaches for how buy and trade items in a trustless way. But most rely on application-specific smart contracts that are difficult to upgrade and reuse.

Kiosk provides a framework for creating decentralized marketplaces. Its smart contracts are building blocks that can be swapped in and out and reconfigured for many different markets.

## How It Works

The Kiosk protocol has three main components: `DINs`, `Markets`, and `Products`.

### DIN

A Decentralized Identification Number (DIN), is a unique, 10-digit product identifier, similar to a barcode. A client can look up a `DIN` on the global `DINRegistry` contract to find its corresponding `Market`.

```cs
function market(uint256 DIN) constant returns (address)
```

### Market

A `Market` stores `Products` and `Orders`. 

It has an interface that buyers can use to purchase a product based on its `DIN`.

```cs
function buy(uint256 DIN, uint256 quantity) payable;
```

A `Market` is also responsible for determining when a seller has fulfilled an `Order` and can withdraw its proceeds.

```cs
function isFulfilled(uint256 orderID) constant returns (bool);
```

### Product

A `Product` tells a `Market` its price and availability.

```cs
function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256);
function isAvailableForSale(uint256 DIN, uint256 quantity) constant returns (bool);
```

It will also receive a callback when a new order has been placed on its `Market`. For Ethereum-based assets, a `Product` is expected to provide instant settlement, or the transaction will fail.
```cs
function handleOrder(uint256 orderID, uint256 DIN, uint256 quantity, address buyer);
```

![kiosk protocol](/kioskprotocol.jpg?raw=true)

**The Kiosk protocol is designed with the buyer in mind**. Its goal is to make the buying experience as simple, consistent, and transparent as possible. With just a product's DIN, a buyer can determine its price and how to buy it on a fair market.

## Quick Start

Get started by testing locally with [TestRPC](https://github.com/ethereumjs/testrpc).

Install project dependencies.

```
npm install
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

## Testing

```
truffle test
```
