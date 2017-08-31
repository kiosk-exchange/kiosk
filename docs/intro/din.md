# DIN

A Decentralized Identification Number (DIN) is a unique 10-digit product identifier, similar to a [UPC](https://en.wikipedia.org/wiki/Universal_Product_Code) or [ISBN](https://en.wikipedia.org/wiki/International_Standard_Book_Number). The key difference is that DINs are not distributed by a centralized entity like [GS1](https://en.wikipedia.org/wiki/GS1). Instead, DINs are registered via a smart contract (see DINMarket), which was not possible before the blockchain.

The DINRegistry is a global contract that keeps a record of each registered DIN, along with its corresponding owner and market.

**`DINRegistry.sol`**
```cs
function owner(uint256 DIN) constant returns (address) {
    return records[DIN].owner;
}

function market(uint256 DIN) constant returns (address) {
    return records[DIN].market;
}
```

## Next Steps

Now you'll learn how a DIN is used by a [Market](intro/market.md) to execute a transaction.
