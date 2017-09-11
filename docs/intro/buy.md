# Buy

A buyer can purchase a product by interacting with a smart contract called `Buy`.

**`Buy.sol`**

```cs
function buy(uint256 DIN, uint256 quantity, uint256 totalValue) public returns (uint256 orderID)
```

When a buyer calls this method, the `Buy` contract uses the global `DINRegistry` to find the address of the `Market` for the given `DIN`.

**`DINRegistry.sol`**
```cs
function market(uint256 DIN) constant returns (address)
```

`Buy` will then verify with the relevant `Market` that the buyer has entered the correct price and that the specified quantity of that product is available. If everything checks out, the price of the transaction will be transferred from the buyer to the `Market` and the product will be sent from the `Market` to the buyer.

In future releases, `Buy` will have more functionality to support different use cases:

**`Buy.sol`**
```cs
function buyCart(uint256[] DINs, uint256[] quantities, uint256[] subtotalValues)
function buyWithPromoCode(uint256 DIN, uint256 quantity, uint256 totalValue, uint8 v, bytes32 r, bytes32 s) 
```

* `buyCart` will allow buyers to purchase multiple products at once in an all-or-nothing transaction. This will effectively allow for a *universal shopping cart*.
* `buyWithPromoCode` will allow sellers to update the price of a product off-chain by signing a transaction and giving the buyer the cryptographic parameters of the signature, presented as a "promo code." `Buy` can then verify the off-chain price update and execute the transaction. Without this, the seller will have to pay a small transaction fee every time they want to update the price of a product on the blockchain.

To keep things simple, `Buy` only supports *synchronous* transactions at the moment. This means only products that can provide instant delivery, such as Ethereum assets and other digital goods are supported. In the future, `Buy` will support *asynchronous* transactions which will allow for sales involving physical goods that require delivery. These transactions will depend on some form of escrow smart contract to hold funds in the interim.

## Next Steps

Now you'll find out what the `totalValue` parameter of `buy` means, and why it requires [Kiosk Market Token](../intro/kiosk-market-token.md).
