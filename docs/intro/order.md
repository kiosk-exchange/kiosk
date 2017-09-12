# Order

When a transaction succeeds, `Buy` will create an `Order`, which is simply a record of the transaction. The order is given a unique `Order ID` and is stored in the global `OrderStore` contract.

**`OrderStore.sol`**
```
struct Order {
    address buyer;
    address seller;
    address market;
    uint256 DIN;
    bytes32 metadata;
    uint256 value;                          
    uint256 quantity;
    uint256 timestamp;
    OrderUtils.Status status;
}

// Order ID => Order
mapping (uint256 => Order) public orders;
```

This immutable record that is stored on the blockchain allows us to create a decentralized reputation system, in which buyers can rate individual products and markets based on past purchases. The reputation system will be implemented in a future release.

## Next Steps

That concludes the introduction to the Kiosk protocol! To summarize, each product has a unique DIN. Each DIN points to a `Market`. The `Market` specifies a product's name, price, availability and other information. The `Buy` contract sends `Kiosk Market Tokens` to a `Market` in exchange for the product being sold. `Orders` are recorded in the `OrderStore` contract.

Now that you understand the motivation behind the Kiosk protocol, you'll learn [how it can be used in practice](../headers/basics.md).