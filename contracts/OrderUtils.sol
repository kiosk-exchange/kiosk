pragma solidity ^0.4.11;

library OrderUtils {
	enum Status {
		Pending,
		Fulfilled,
		Canceled,
		Refunded
	}
}
