# Market

A market is an interface that Kiosk's `Buy` smart contract interacts with to complete a sale.

**`Market.sol`**
```
string public name;
function buy(uint256 DIN, uint256 quantity, uint256 value, address buyer, bool approved) returns (bool);
function isFulfilled(uint256 orderID) constant returns (bool);
function nameOf(uint256 DIN) constant returns (string);
function metadata(uint256 DIN) constant returns (bytes32);
function totalPrice(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256);
function availableForSale(uint256 DIN, uint256 quantity, address buyer) constant returns (bool);
```

