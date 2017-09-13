# Kiosk

Kiosk is a protocol for buying and selling products using the Ethereum blockchain.

## Documentation
* [Introduction](https://kioskprotocol.gitbooks.io/kiosk/content/)
* [How It Works](https://kioskprotocol.gitbooks.io/kiosk/content/headers/how-it-works.html)
* [Buying a Product](https://kioskprotocol.gitbooks.io/kiosk/content/basics/buy-product.html)

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
