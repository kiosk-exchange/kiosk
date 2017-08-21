==================
Create a Market
==================

A ``Market`` is a contract that implements the following methods: ::

	function isFulfilled(uint256 orderID) constant returns (bool);
	function buy(uint256 orderID) returns (bool);
	function price(uint256 DIN, uint256 quantity, address buyer) constant returns (uint256);
	function availableForSale(uint256 DIN, uint256 quantity) constant returns (bool);

A market provides critical information about a given product — its price (denominated in Kiosk Market Token) and availability.

The ``isFulfilled`` method allows a market to implement a condition to prove that the seller has delivered its product to the buyer. For example, if the product was an ENS domain, the market might check the ENS registry to confirm that the buyer is now the owner of the domain. The market executes code in its ``buy`` method to make sure the ``isFulfilled`` condition is satisfied.

A market contract should also implement a way for sellers to add and modify products. This can be done in any number of ways. Example implementations can be found in `DIN Market <https://github.com/kioskprotocol/kiosk/blob/master/contracts/DIN/DINMarket.sol>`_ and `ENS Market <https://github.com/kioskprotocol/kiosk/blob/master/contracts/ENSMarket/ENSMarket.sol>`_.

Markets are implicitly not rent-seeking. Market creators can add a transaction fee or any other logic to a market, but must ultimately convince both buyers and sellers that their market is the best choice.

Eventually, buyers and sellers will be able to rate markets based on existing orders, which will give market creators a strong incentive to build fair markets.