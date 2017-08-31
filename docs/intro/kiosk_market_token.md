# Kiosk Market Token

Kiosk Market Token is an ERC20 token. The ERC20 token standard defines a  method called `transfer` that subtracts from the sender's token balance and adds to the recipient's token balance.

```
  function transfer(address _to, uint256 _value) returns (bool) {
    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    return true;
  }
```

In addition to `transfer`, Kiosk Market Token implements a method called `buy`, which initiates a two-way exchange of value. This is the foundation of the Kiosk protocol.

```
function buy(uint256 DIN, uint256 quantity, uint256 value) returns (uint256)
```