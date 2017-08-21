=============================================================
Decentralized Identification Number (DIN)
=============================================================

A DIN is a unique, 10-digit number that is used to represent a product. It is a global product identifier, similar to a `UPC <https://en.wikipedia.org/wiki/Universal_Product_Code>`_ or `ISBN <https://en.wikipedia.org/wiki/International_Standard_Book_Number>`_.

The DIN Registry is a smart contract that stores all registered DINs. Clients can use the DIN Registry to determine a product's owner and market. ::

	function owner(uint256 DIN) constant returns (address)

	function market(uint256 DIN) constant returns (Market)

A Decentralized Identification Number is itself a product with a DIN of ``1000000000``. A DIN has a price of zero, so one can be purchased for free. Right now, DINs are distributed sequentially. To see how, check out `DINMarket <https://github.com/kioskprotocol/kiosk/blob/master/contracts/DIN/DINMarket.sol>`_.

To get a DIN for your product, see “Buying a Product.”