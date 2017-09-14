# Creating a Market

To create a market on Kiosk, you'll need to write a smart contract that implements the interface specified in `Market.sol`.

```cs
contract Market {
    // The name of the market.
    string public name;

    // Buy a product. Returns true if the transaction was successful.
    function buy(uint256 DIN, uint256 quantity, uint256 value, address buyer, bool approved) returns (bool);

    // Returns true if the seller has fulfilled the order.
    function isFulfilled(uint256 orderID) constant returns (bool);

    // The name of a product.
    function nameOf(uint256 DIN) constant returns (string);

    // A hash representation of a product's metadata that is added to the order.
    function metadata(uint256 DIN) constant returns (bytes32);

    // The total price of a product for a given quantity and buyer.
    function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256);

    // Returns true if a given quantity of a product is available for purchase.
    function availableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool);
}
```

The markets that Kiosk has already created should serve as a good reference point for creating a new market:

* [DINMarket](https://github.com/kioskprotocol/kiosk/blob/master/contracts/DIN/DINMarket.sol)
* [EtherMarket](https://github.com/kioskprotocol/kiosk/blob/master/contracts/ether/EtherMarket.sol)
* [ENSMarket](https://github.com/kioskprotocol/kiosk/blob/master/contracts/ENS/ENSMarket.sol)

Things to consider:

* Make sure the `buy` method can only be called by Kiosk's `Buy` contract.
* Include a way for sellers to keep track of and withdraw proceeds from sales.
* A product should never get "stuck" on your market. One possible solution is to make the price zero if the buyer is the seller.
* Include a way to access the Kiosk protocol contracts stored on `Kiosk.sol`, so that if they are ever updated, your market will be able to update accordingly. The Kiosk markets all use `StandardMarket.sol` as a base class for this purpose.

If you are considering creating a market, we would love to help out. Feel free to ask us questions on [Slack]().

