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

To register a DIN, you can buy one just like all other products that use the Kiosk protocol. A DIN as a product is represented by the genesis DIN of `1000000000`. It is free (besides [Ethereum gas costs](https://www.ethereum.org/ether)) to register a DIN, which can then be used to sell a product. DINs are distributed sequentially, beginning with the genesis DIN.

## Next Steps

Now that you know what a DIN is and how to get one, you'll learn how to [buy](../intro/buy.md) a product based on its DIN.
