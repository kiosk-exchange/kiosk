import './DINRegistry.sol';
import './PriceResolver.sol';
import './InventoryResolver.sol';
import './BuyHandler.sol';
import './Market.sol';
import './OrderTracker.sol';

pragma solidity ^0.4.11;

/**
*  This is the default Kiosk implementation of a public Market contract.
*  Subclasses must implement "isFulfilled".
*/
contract PublicMarket is Market {

    struct Product {
        PriceResolver priceResolver;            // Returns product price.
        InventoryResolver inventoryResolver;    // Returns whether product is in stock.
        BuyHandler buyHandler;                  // Returns the address of the contract that handles orders.
    }

    struct Order {
        address buyer;
        address seller;
        uint256 DIN;
        uint256 amountPaid;
        uint256 timestamp;
        OrderStatus status;
    }

    enum OrderStatus {
        Pending,
        Canceled,
        Fulfilled
    }

    // The address of DIN registry where all DINs are stored.
    DINRegistry public dinRegistry;

    // The address of the order tracker where all new order events are stored.
    OrderTracker public orderTracker;

    // DIN => Product
    mapping (uint256 => Product) products;

    // Order ID => Order
    mapping (uint256 => Order) public orders;

    // Order ID => Amount paid
    mapping (uint256 => uint256) public pendingWithdrawals;

    // Events
    event ProductInfoChanged(uint256 indexed DIN, address ProductInfo);
    event PriceResolverChanged(uint256 indexed DIN, address PriceResolver);
    event InventoryResolverChanged(uint256 indexed DIN, address InventoryResolver);
    event BuyHandlerChanged(uint256 indexed DIN, address BuyHandler);

    modifier only_owner(uint256 DIN) {
        require (dinRegistry.owner(DIN) == msg.sender);
        _;
    }

    modifier only_correct_price(uint256 DIN, uint256 quantity) {
        require(price(DIN, quantity) == msg.value);
        _;
    }

    modifier only_in_stock(uint256 DIN, uint256 quantity) {
        require(availableForSale(DIN, quantity) == true);
        _;
    }

    modifier only_fulfilled(uint256 orderID) {
        require (orders[orderID].status == OrderStatus.Fulfilled);
        _;
    }

    // This contract does not accept ether directly. Use the "buy" function to buy a product.
    function () {
        throw;
    }

    // Constructor
    function PublicMarket(DINRegistry _dinRegistry, OrderTracker _orderTracker) {
        dinRegistry = _dinRegistry;
        orderTracker = _orderTracker;
    }

    /**
    *   =========================
    *            Orders         
    *   =========================
    */

    /**
     * Buy a quantity of a product.
     * @param DIN The DIN of the product to buy.
     * @param quantity The quantity to buy.
     */   
    function buy(uint256 DIN, uint256 quantity) 
        payable
        only_correct_price(DIN, quantity) 
        only_in_stock(DIN, quantity)
        returns (uint256) 
    {
    	address seller = dinRegistry.owner(DIN);

        // Add the order to the order tracker and get the order ID.
        uint256 orderID = orderTracker.registerNewOrder(
            msg.sender, 
            seller,
            DIN,
            msg.value, 
            block.timestamp
        );

        // Add the order to internal storage.
        orders[orderID] = Order(
            msg.sender, 
            seller, 
            DIN, 
            msg.value, 
            block.timestamp,
            OrderStatus.Pending
        );

        // Add proceeds to pending withdrawals.
        pendingWithdrawals[orderID] += msg.value;

        // Call the product's buy handler to fulfill the order.
        products[DIN].buyHandler.handleOrder(orderID, DIN, quantity, msg.sender);

        // Throw an error if the order is not fulfilled.
        require (isFulfilled(orderID) == true);

        // Mark the order as fulfilled.
        orders[orderID].status = OrderStatus.Fulfilled;

        return 0;
    }

    /**
    *   Withdraw proceeds of sales.
    */
    function withdraw(uint256 orderID) only_owner(orders[orderID].DIN) only_fulfilled(orderID) {
        uint256 amount = pendingWithdrawals[orderID];

        // Zero the pending refund before to prevent re-entrancy attacks.
        pendingWithdrawals[orderID] = 0;
        msg.sender.transfer(amount);
    }

    /**
    *   =========================
    *      Product Information          
    *   =========================
    */ 

    // Price
    function price(uint256 DIN, uint256 quantity) constant returns (uint256) {
        return products[DIN].priceResolver.totalPrice(DIN, quantity, msg.sender);
    }

    function priceResolver(uint256 DIN) constant returns (address) {
        return products[DIN].priceResolver;
    }

    function setPriceResolver(uint256 DIN, PriceResolver resolver) only_owner(DIN) {
        products[DIN].priceResolver = resolver;
        PriceResolverChanged(DIN, resolver);
    }

    // Inventory
    function availableForSale(uint256 DIN, uint256 quantity) constant returns (bool) {
        return products[DIN].inventoryResolver.isAvailableForSale(DIN, quantity);
    }

    function inventoryResolver(uint256 DIN) constant returns (address) {
        return products[DIN].inventoryResolver;
    }

    function setInventoryResolver(uint256 DIN, InventoryResolver resolver) only_owner(DIN) {
        products[DIN].inventoryResolver = resolver;
        InventoryResolverChanged(DIN, resolver);
    }

    // Buy
    function buyHandler(uint256 DIN) constant returns (address) {
        return products[DIN].buyHandler;
    }

    function setBuyHandler(uint256 DIN, BuyHandler handler) only_owner(DIN) {
        products[DIN].buyHandler = handler;
        BuyHandlerChanged(DIN, handler);
    }

}
