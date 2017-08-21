======================
Buying a Product
======================

Buyers can buy products using Kiosk Market Token, which is an `ERC20 Token <https://theethereum.wiki/w/index.php/ERC20_Token_Standard>`_ with an additional method called ``buy``. ::

	function buy(uint256 DIN, uint256 quantity, uint256 value) returns (bool)

This method is the core of the Kiosk protocol. Instead of simply transferring tokens from one account to another like ``transfer`` or ``transferFrom`` in the ERC20 standard, ``buy`` provides an interface for a two-way transaction in which the buyer exchanges tokens for some `consideration <https://en.wikipedia.org/wiki/Consideration>`_ from the seller.

The buy method interacts with a DIN’s corresponding ``Market`` contract. ::

	/**
	* Buy a product.
	* @param DIN The DIN of the product to buy.
	* @param quantity The quantity to buy.
	* @param value The total price of the product(s).
	*/   
	function buy(uint256 DIN, uint256 quantity, uint256 value) returns (bool) {
		// Get the address of the market.
		Market market = dinRegistry.market(DIN);

		// The buyer must have enough tokens for the purchase.
		require (balances[msg.sender] >= value);

		// The requested quantity must be available for sale.
		require(market.availableForSale(DIN, quantity) == true);

		// The value must match the market price. 
		require(market.price(DIN, quantity, msg.sender) == value);

		// Get the address of the seller.
		address seller = dinRegistry.owner(DIN);

		// Add the order to the order tracker and get the order ID.
		uint256 orderID = orderTracker.registerNewOrder(
			msg.sender,
			seller,
			market,
			DIN,
			value,
			quantity,
			block.timestamp
		);

		// Tell the market to execute the order.
		market.buy(orderID);

		// Throw an error if the order is not fulfilled by the market.
		if (market.isFulfilled(orderID) == true) {
			// Transfer the value of the order to the market.
			balances[msg.sender] = balances[msg.sender].sub(value);
			balances[market] = balances[market].add(value);
			Transfer(msg.sender, market, value);

			// Mark the order fulfilled.
			orderTracker.setStatus(orderID, OrderUtils.Status.Fulfilled);

			// Return true for transaction success.
			return true;
		}

		// Mark the order canceled. This can be used by future buyers to evaluate market trustworthiness.
		orderTracker.setStatus(orderID, OrderUtils.Status.Canceled);

		// Return false for transaction failure.
		return false;
	}

**NOTE: This method does not follow Solidity best practices. Future implementations will likely contain breaking changes.**

First, it verifies that the product is available for sale and that the value parameter is equal to the market price. Then it creates an ``Order`` and stores it on the global ``OrderTracker``. It will then execute the ``Market`` method ``buy(uint256 orderID)`` which must execute one or many transactions so that its method ``isFulfilled(uint256 orderID)`` will return ``true``.

This method is designed to make the buying experience as simple as possible. For example, to buy a new ``DIN``, you could run the following: ::

	KioskMarketTokenContract.buy(1000000000, 1, 0)
