# Market

A market is an interface that Kiosk's `Buy` smart contract interacts with to complete a sale.

**`Market.sol`**
```cs
string public name;
function buy(uint256 DIN, uint256 quantity, uint256 value, address buyer, bool approved) returns (bool);
function isFulfilled(uint256 orderID) constant returns (bool);
function nameOf(uint256 DIN) constant returns (string);
function metadata(uint256 DIN) constant returns (bytes32);
function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256);
function availableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool);
```

Each transaction follows the same sequence of events:
* `Buy` confirms that the `totalValue` of the purchase matches the market's `totalPrice` for the given product and quantity.
* `Buy` confirms that the given quantity is `availableForSale`.
* `Buy` calls the market's `buy` method, which should transfer the product to the buyer. For example, if the product is an [ENS domain](https://ens.domains/), the market should transfer ownership of the domain to the buyer at this point.
* `Buy` calls the market's `isFulfilled` method, which should check that buyer is now the owner of the product.
* If `isFulfilled` returns `true`, `Buy` will transfer the `totalValue` of Kiosk Market Tokens from the buyer to the market.
* If any of these steps fails, the transaction fails and all changes are reverted.

The `Market` interface is designed to be flexible for market developers and sellers. For example, pricing can be dynamic based on quantity or buyer. In addition, a `Market` can make calls to outside smart contracts in its `buy` implementation, with the safety of the `isFulfilled` check afterwards.

There is no standard `withdraw` method on `Market`. A `Market` may offer payments in the currency of the seller's choosing as a competitive advantage. The `Market` owns the relationship with the seller.

## Next Steps

At this point, it is still trivial to create an unfair market. Now you'll see how a global record of [Orders](../intro/order.md) can encourage good behavior.