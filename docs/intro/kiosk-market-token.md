# Kiosk Market Token

The price of products using the Kiosk protocol is denominated in `Kiosk Market Token (KMT)`. `Kiosk Market Token` is a [protocol token](https://blog.0xproject.com/the-difference-between-app-coins-and-protocol-tokens-7281a428348c) that implements the [ERC20 token standard](https://theethereum.wiki/w/index.php/ERC20_Token_Standard) along with one additional method:

`KioskMarketToken.sol`

```cs
function transferFromBuy(address _from, address _to, uint256 _value) returns (bool)
```

The ERC20 standard lets token holders approve smart contracts to spend tokens on their behalf.

`ERC20.sol`

```
function approve(address _spender, uint _value) returns (bool success)
```

This approval process works on an _individual basis_.

`Kiosk Market Token` gives `Buy` the ability to spend a user's tokens at the _protocol level_. During a transaction, the `Buy` contract calls `transferFromBuy` which gives it special access to spend from of the buyer's balance. This gives a `Market` certainty that the buyer will always fulfill his or her end of the transaction, which in turn gives developers a greater incentive to build markets on top of the Kiosk protocol.

On the test network version of Kiosk, one of the first products available is Ether \(ETH\). This means you can effectively convert your `Kiosk Market Token` back to Ether at any time. We plan to do something similar when we launch on the main network to give holders confidence that this new token has a [book value](https://en.wikipedia.org/wiki/Book_value).

In a future release, holders of `Kiosk Market Token` will be able to vote on upgrades to the Kiosk protocol contracts using some form of [decentralized governance](https://en.wikipedia.org/wiki/Decentralized_autonomous_organization).

`Kiosk Market Token` will have a fixed supply to benefit early adopters and the Kiosk developers through price appreciation. This also ensures that Kiosk can exist as an open-source protocol that charges no transaction fee. With the blockchain, the monetary nature of the protocol _is the business model_.

## Next Steps

Now you'll find out how `Buy` interacts with a [Market](../intro/market.md) to execute a transaction.

