# Order

When a transaction is successful, `Buy` will create an `Order`, which is simply a record of the transaction that is stored in the `OrderStore` contract.

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

With a global record of orders that is stored directly on the blockchain (instead of in the event logs which are not accessible to smart contracts), we can create and encourage third-party developers to create decentralized reputation systems with which buyers can rate individual markets based on previous orders.