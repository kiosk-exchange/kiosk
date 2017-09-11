# DIN

Each product on Kiosk is identified by a unique, 10-digit product code called a Decentralized Identification Number (DIN). Buyers use this number to indicate the product they would like to buy.

The DINRegistry is a smart contract that keeps a record of each registered DIN, along with its corresponding owner and market.

**`DINRegistry.sol`**
```cs
function owner(uint256 DIN) constant returns (address) {
    return records[DIN].owner;
}

function market(uint256 DIN) constant returns (address) {
    return records[DIN].market;
}
```

To register a DIN, you buy it just like all other products that use the Kiosk protocol. That's right, a DIN has a DIN! Specifically, it is represented by the genesis DIN of `1000000000`. It is free (besides [Ethereum gas costs](https://www.ethereum.org/ether)) to register a DIN, which can then be used to sell a product.

On [kioskprotocol.com](http://www.kioskprotocol.com), you can buy a DIN and then check the metadata of your order in the Purchases tab of the side menu to find out what DIN you registered. DINs are distributed sequentially, beginning with the genesis DIN.

## Next Steps

Now that you know what a DIN is and how to get one, you'll learn to [buy](../intro/buy.md) a product based on its DIN.
