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
        ProductInfo info;                       // Returns info about a given product.
        PriceResolver priceResolver;            // Returns the price of a given product.
        InventoryResolver inventoryResolver;    // Returns whether a product is in stock.
        BuyHandler buyHandler;                  // Returns the contract that handles orders.
        bool isValid;                           // True if all properties are set.
    }

    struct Order {
        address buyer;
        address seller;
        uint256 DIN;
        uint256 amountPaid;
        uint256 timestamp;
    }

    // The address of DIN registry where all product IDs are stored.
    DINRegistry public dinRegistry;

    // Product ID (DIN) => Product
    mapping (uint256 => Product) products;

    uint256 public orderIndex = 0;

    // Order ID => Order
    mapping (uint256 => Order) public orders;

    // Product ID (DIN) => Pending revenue
    mapping (uint256 => uint256) public pendingWithdrawals;

    // Kiosk fee, per successful transaction
    uint256 public fee = .001 ether;
    uint256 public kioskDIN;

    // Events
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
        require(price(DIN) * quantity == msg.value);
        require(msg.value > fee);
        _;
    }

    modifier only_in_stock(uint256 DIN, uint256 quantity) {
        require(inStock(DIN, quantity) == true);
        _;
    }

    modifier only_valid_product(uint256 DIN) {
        require(products[DIN].isValid == true);
        _;
    }

    /**
     * Constructor.
     * @param dinRegistryAddr The address of the DIN registry contract.
     */
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
    ) {
        products[DIN].info = info;
        products[DIN].priceResolver = priceResolver;
        products[DIN].inventoryResolver = inventoryResolver;
        products[DIN].buyHandler = buyHandler;

        products[DIN].isValid = true;
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
    function buy(
        uint256 DIN, 
        uint256 quantity
    ) 
        payable 
        only_correct_price(DIN, quantity) 
        only_in_stock(DIN, quantity) 
    {
    	  address seller = dinRegistry.owner(DIN);

        // Increment the order index for a new order.
        orderIndex++;

        // Add the order to the order tracker.
        orders[orderIndex] = Order(
            msg.sender, 
            seller, 
            DIN, 
            msg.value, 
            block.timestamp
        );

        NewOrder(
            orderIndex, 
            msg.sender, 
            seller, 
            DIN, 
            msg.value, 
            block.timestamp
        );

        pendingWithdrawals[DIN] += msg.value - fee;
        pendingWithdrawals[kioskDIN] += fee;

        // Call the seller's buy handler.
        products[DIN].buyHandler.handleOrder(
            DIN, 
            quantity,
            msg.sender
        );
    }



    /**
    *   Withdraw proceeds of sales.
    */
    function withdraw(uint256 DIN) only_owner(DIN) {
        uint256 amount = pendingWithdrawals[DIN];

        // Zero the pending refund before to prevent re-entrancy attacks.
        pendingWithdrawals[DIN] = 0;
        msg.sender.transfer(amount);
    }


    //   =========================
    //      Product Information 
    //   =========================
    

    // Price
    function price(uint256 DIN) constant returns (uint256) {
        return products[DIN].priceResolver.price(DIN, msg.sender);
    }

    function priceResolver(uint256 DIN) constant returns (address) {
        return products[DIN].priceResolver;
    }

    function setPriceResolver(uint256 DIN, PriceResolver resolver) only_owner(DIN) {
        products[DIN].priceResolver = resolver;
        PriceResolverChanged(DIN, resolver);
    }

    // Inventory
    function inStock(uint256 DIN, uint256 quantity) constant returns (bool) {
        return products[DIN].inventoryResolver.inStock(DIN, quantity);
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
