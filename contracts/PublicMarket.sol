import './DINRegistry.sol';
import './ProductInfo.sol';
import './PriceResolver.sol';
import './InventoryResolver.sol';
import './BuyHandler.sol';
import './Market.sol';

pragma solidity ^0.4.11;

/**
*  This is the default Kiosk implementation of a public Market contract.
*/
contract PublicMarket is Market {

    struct Product {
        ProductInfo info;                       // Returns product details.
        PriceResolver priceResolver;            // Returns product price.
        InventoryResolver inventoryResolver;    // Returns whether product is in stock.
        BuyHandler buyHandler;                  // Returns the address of the contract that handles orders.
        bool isValid;                           // True if all above properties are set.
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

    // The address of DIN registry where all product IDs are stored.
    DINRegistry public dinRegistry;

    // DIN => Product
    mapping (uint256 => Product) products;

    uint256 public orderIndex = 0;

    // Order ID => Order
    mapping (uint256 => Order) public orders;

    // Order ID => Amount paid
    mapping (uint256 => uint256) public pendingWithdrawals;

    // Events
    event ProductInfoChanged(uint256 indexed DIN, address ProductInfo);
    event PriceResolverChanged(uint256 indexed DIN, address PriceResolver);
    event InventoryResolverChanged(uint256 indexed DIN, address InventoryResolver);
    event BuyHandlerChanged(uint256 indexed DIN, address BuyHandler);

    event NewOrder(
        uint orderID, 
        address indexed buyer, 
        address indexed seller, 
        uint256 indexed DIN,
        uint256 amountPaid, 
        uint256 timestamp
    );

    modifier only_owner(uint256 DIN) {
        require (dinRegistry.owner(DIN) == msg.sender);
        _;
    }

    modifier only_seller(uint256 orderID) {
        require(orders[orderID].seller == msg.sender);
        _;
    }

    modifier only_correct_price(uint256 DIN, uint256 quantity) {
        require(msg.value > 0); // The price cannot be set to zero.
        require(totalPrice(DIN, quantity) == msg.value);
        _;
    }

    modifier only_in_stock(uint256 DIN, uint256 quantity) {
        require(isAvailableForSale(DIN, quantity) == true);
        _;
    }

    modifier only_valid_product(uint256 DIN) {
        require(products[DIN].isValid == true);
        _;
    }

    modifier only_fulfilled(uint256 orderID) {
        require (orders[orderID].status == OrderStatus.Fulfilled);
        _;
    }

    // Constructor
    function PublicMarket(DINRegistry dinRegistryAddr) {
        dinRegistry = dinRegistryAddr;
    }

    // This contract does not accept ether directly. Use the "buy" function to buy a product.
    function () {
        throw;
    }

    /**
    *   =========================
    *          Add Product          
    *   =========================
    */

    function addProduct(
        uint256 DIN,
        ProductInfo info, 
        PriceResolver priceResolver, 
        InventoryResolver inventoryResolver, 
        BuyHandler buyHandler
    ) 
        only_owner(DIN)
    {
        products[DIN].info = info;
        products[DIN].priceResolver = priceResolver;
        products[DIN].inventoryResolver = inventoryResolver;
        products[DIN].buyHandler = buyHandler;

        // Product has been initialized and is now valid.
        products[DIN].isValid = true;
    }

    // *
    // *   =========================
    // *            Orders          
    // *   =========================
    

    /**
     * Buy a quantity of a product.
     * @param DIN The DIN of the product to buy.
     * @param quantity The quantity to buy.
     */   
    function buy(uint256 DIN, uint256 quantity) 
        payable
        only_valid_product(DIN)
        only_correct_price(DIN, quantity) 
        only_in_stock(DIN, quantity) 
    {
    	address seller = dinRegistry.owner(DIN);

        // Increment the order index for a new order.
        orderIndex++;

        // Add the order to the orders mapping.
        orders[orderIndex] = Order(
            msg.sender, 
            seller, 
            DIN, 
            msg.value, 
            block.timestamp,
            OrderStatus.Pending
        );

        NewOrder(
            orderIndex, 
            msg.sender, 
            seller, 
            DIN,
            msg.value, 
            block.timestamp
        );

        pendingWithdrawals[orderIndex] += msg.value;

        // Call the seller's buy handler.
        products[DIN].buyHandler.handleOrder(DIN, quantity, msg.sender);
    }

    function isFulfilled(uint256 orderID) constant returns (bool) {
        return false;
    }

    /**
    *   Withdraw proceeds of sales.
    */
    function withdraw(uint256 orderID) only_seller(orderID) only_fulfilled(orderID) {
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

    // Info
    function info(uint256 DIN) constant returns (address) {
        return products[DIN].info;
    }

    function setInfo(uint256 DIN, ProductInfo info) only_owner(DIN) {
        products[DIN].info = info;
        ProductInfoChanged(DIN, info);
    }

    // Price
    function unitPrice(uint256 DIN) constant returns (uint256) {
        return totalPrice(DIN, 1);
    }

    function totalPrice(uint256 DIN, uint256 quantity) constant returns (uint256) {
        return products[DIN].priceResolver.totalPrice(DIN, quantity, msg.sender);
    }

    function priceResolver(uint256 DIN) constant returns (address) {
        return products[DIN].priceResolver;
    }

    function setPriceResolver(uint256 DIN, PriceResolver resolver) only_owner(DIN) {
        products[DIN].priceResolver = resolver;
        PriceResolverChanged(DIN, resolver);
    }

    // // Inventory
    function isAvailableForSale(uint256 DIN, uint256 quantity) constant returns (bool) {
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

    // Valid
    function isValid(uint256 DIN) constant returns (bool) {
        return products[DIN].isValid;
    }

}
