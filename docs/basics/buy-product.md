# Buying a Product

To buy a product using Kiosk on the test network, you'll first need some test Ether that you can convert to Kiosk Market Tokens. The Kiosk protocol smart contracts are currently deployed to the [Kovan Test Network](https://kovan-testnet.github.io/website/). We chose Kovan because it offers the most developer-friendly options for getting test Ether through its [faucet](https://github.com/kovan-testnet/faucet). If you can't get it to work, feel free to ping us on [Slack](https://join.slack.com/t/kioskprotocol/shared_invite/MjI3NzAwMzMyMTYyLTE1MDI5MjYyNzItM2FiMjA1NWIxZg) and we'll send you some test Ether.

The easiest way to buy a product is through the user interface hosted at [kioskprotocol.com](http://www.kioskprotocol.com/). The website is [open-source](https://github.com/kioskprotocol/kiosk) and simply reads and displays information that is stored on the blockchain.

To interact with the website, you must use Google Chrome with either the [MetaMask](https://metamask.io/) or [Parity](https://chrome.google.com/webstore/detail/parity-ethereum-integrati/himekenlppkgeaoeddcliojfddemadig) Chrome extension installed. If you're not a developer, we recommend using MetaMask because Parity requires that you run your own [Ethereum node](https://github.com/paritytech/parity/wiki/Basic-Usage). These extensions inject a [web3](https://github.com/ethereum/web3.js/) Javascript object into the browser, which Kiosk needs in order to read from and write to the blockchain. Web3 is the Javascript API for interacting with a blockchain that implements the Ethereum protocol.

While using the website is the simplest way to buy a product, it might be useful to try to use the Kiosk protocol from the command line for custom use cases or to solidify your understanding of how the blockchain works.

The following intructions require a bit of technical knowledge. The Ethereum blockchain has an API for interacting with smart contracts. On today's Internet, we are familiar with APIs that _transmit information_. The Ethereum API allows you to _transmit value_.

First, you need the [Application Binary Interface \(ABI\)](https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI) of the `Buy` smart contract and its address on the blockchain. Its ABI and address on Kovan are below:

```json
Address: 0xb309f6b255302c4e069c95072f4388e53bd981e4
ABI:
[{"constant":false,"inputs":[{"name":"DIN","type":"uint256"},{"name":"quantity","type":"uint256"},{"name":"totalValue","type":"uint256"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"> const buyContract2 = web3.eth.contract([{"constant":false,"inputs":[{"name":"DIN","type":"uint256"},{"name":"quantity","type":"uint256"},{"name":"totalValue","type":"uint256"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"buyWithPromoCode","outputs":[{"name":"orderID","type":"uint256"}],"payable":> const buyContract2 = web3.eth.contract([{"constant":false,"inputs":[{"name":"DIN","type":"uint256"},{"name":"quantity","type":"uint256"},{"name":"totalValue","type":"uint256"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"nam> const buyCon> const> const> const buyContract2 = web3.eth.contract([{"constant":false,"inputs":[{"name":"DIN","type":"uint256"},{"name":"quantity","type":"uint256"},{"name":"totalValue","type":"uint256"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"buyWithPromoCode","outputs":[{"name":"orderID","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"},{"name":"quantity","type":"uint256"},{"name":"buyer","type":"address"}],"name":"availableForSale","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"orderStore","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"},{"name":"quantity","type":"uint256"},{"name":"buyer","type":"address"}],"name":"totalPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"DIN","type":"uint256"},{"name":"quantity","type":"uint256"},{"name":"totalValue","type":"uint256"}],"name":"buy","outputs":[{"name":"orderID","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"DINs","type":"uint256[]"},{"name":"quantities","type":"uint256[]"},{"name":"subtotalValues","type":"uint256[]"}],"name":"buyCart","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"updateKiosk","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"registry","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"signer","type":"address"},{"name":"hash","type":"bytes32"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"isValidSignature","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"orderMaker","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"KMT","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"kiosk","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"GENESIS_DIN","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"buyDIN","outputs":[{"name":"DIN","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"DIN","type":"uint256"}],"name":"metadata","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"inputs":[{"name":"_kiosk","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"errorId","type":"uint8"}],"name":"LogError","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"DIN","type":"uint256"}]
```

Make sure you have [Node.js](https://nodejs.org/en/) installed. Then, install the Web3 module.

```
$ npm install web3
```

Then, we need to initialize a web3 object to connect to the blockchain.

You can use a third-party provider like [Infura](https://infura.io/index.html) if you don't want to sync the blockchain yourself. MetaMask is built on top of Infura.

```
$ node
> Web3 = require("web3")
> web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/[ACCESS_TOKEN]""));
```

If you want to sync the Kovan blockchain on your own, you can use Parity.

1\) Install Parity

```
$ bash <(curl https://get.parity.io -L)
```

2\) Sync the Kovan Test Network blockchain

```
$ parity ui --chain kovan
```

3\) Initialize the web3 object.

```js
$ node
> Web3 = require("web3")
> web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
```

Now that we have a web3 object, we can get the deployed `Buy` contract using the ABI and address from earlier.

```js
> const buyContract = web3.eth.contract(INSERT_ABI_HERE).at("0xb309f6b255302c4e069c95072f4388e53bd981e4")
```

Then we can use the Kiosk protocol to find out the price of a product. Let's find out the price of 1 Ether, which is DIN `1000000001`. The 1 passed in as the second argument represents quantity.

```js
> buyContract.totalPrice(1000000001, 1, "YOUR_ETHEREUM_ACCOUNT", (err, result) => { console.log(result.toNumber()) })
> 300000000000000000000
```

This is the price of one Ether in the base unit of Kiosk Market Token. Like many ERC20 tokens, Kiosk Market Tokens has 18 decimal places.

```
> 300000000000000000000 / 10**18
> 300
```

So the price is 300 KMT! Which is exactly what you will see on the website. Now, assuming you've gotten your hands on at least 300 KMT via the "Get Kiosk Market Tokens" button on [kioskprotocol.com](http://www.kioskprotocol.com/), let's buy that product. If you don't have Kiosk Market Tokens, but you have Ether, try buying product `1000000000` which represents a new DIN and costs zero KMT.

Instead of counting out zeros, you can use a web3 shortcut for the price. Ether uses 18 decimals too and its smallest unit is called wei. The function below just multiplies the input by 10^18.

```
> web3.toWei(300, "ether")
> '300000000000000000000'
```

Then you can buy the product from the command line.

```
> buyContract.buy(1000000001, 1, 300000000000000000000, { from: "YOUR_ETHEREUM_ACCOUNT" })
```

This should prompt a transaction that you will need to confirm using Parity's UI at [http://127.0.0.1:8180/](http://127.0.0.1:8180/). If all goes well your Ether balance will increase by 1 and your Kiosk Market Token balance will decrease by 300. You can check your purchases and balances at [kioskprotocol.com](http://www.kioskprotocol.com/).

## The Big Picture

The point to get across here is that Kiosk is a _protocol_ for buying products. In order to buy a product on Amazon, you need to go to [https://www.amazon.com/](https://www.amazon.com/). To buy a product with Kiosk, you can use any interface you choose as long as it can communicate with the public Ethereum blockchain. That is a fundamental shift from how Internet works today.

If the process of installing a Chrome extension and syncing the blockchain seems clunky to you, that's because it is. We are still at the earliest stages of blockchain technology. Kiosk is trying to create a global product registry and an API for buying those products. We think those are big ideas, so we're willing to work through the high set-up costs at this stage and we believe there are a passionate set of developers and early adopters who feel the same way.

