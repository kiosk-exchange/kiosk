pragma solidity ^0.4.11;

import "../PublicMarket.sol";
import "../DINRegistry.sol";
import "../OrderTracker.sol";
import "zeppelin-solidity/contracts/token/ERC20.sol";

// This is a market for a specific ERC20 token.
contract TokenMarket is PublicMarket {
	// TODO: Is there a way to make this generic for all tokens instead of having a market for each one?
	string public title = "Kiosk Market Token (KMT) Market";
	ERC20 public token;

	function TokenMarket(
		DINRegistry _dinRegistry, 
		OrderTracker _orderTracker,
		ERC20 _token
	)
		PublicMarket(
			_dinRegistry,
			_orderTracker
		)
	{
		token = _token;
	}

	// DIN => Quantity
	mapping(uint256 => uint256) public asks;

	function orderInfo(uint256 DIN, address buyer) constant returns (bytes32) {
		// Add the buyer's initial token balance to the order.
		return bytes32(token.balanceOf(buyer));
	}

	function isFulfilled(uint256 orderID) constant returns (bool) {
		// The buyer's initial token balance is attached to the order.
		uint256 beginBalance = uint256(orders[orderID].info);

		// The buyer's current token balance.
		uint256 endBalance = token.balanceOf(orders[orderID].buyer);

		// The number of tokens purchased by the buyer.
		uint256 quantity = orders[orderID].quantity;

		// If the buyer's token balance has increased by the expected amount, the transaction is successful.
		return (endBalance == beginBalance + quantity);
	}

	function name(uint256 DIN) constant returns (string) {
		return "Kiosk Market Token";
	}

	function quantity(uint256 DIN) constant returns (uint256) {
		return asks[DIN];
	}

	function setQuantity(uint256 DIN, uint256 quantity) only_trusted(DIN) {
		asks[DIN] = quantity;
	}

	// Helper
	// TODO: Move this to a string utils.
    function bytes32ToString(bytes32 x) constant returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }

} 