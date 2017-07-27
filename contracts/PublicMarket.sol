// import './DINRegistry.sol';
// import './ProductInfo.sol';
// import './PriceResolver.sol';
// import './InventoryResolver.sol';
// import './BuyHandler.sol';
// import './Market.sol';

// pragma solidity ^0.4.11;

// /**
// *  This is the default Kiosk implementation of a public Market contract.
// */
// contract PublicMarket is Market {

//     struct Product {
//         string name;
//         ProductInfo info;                       // Returns info about a given product.
//         PriceResolver priceResolver;            // Returns the price of a given product.
//         InventoryResolver inventoryResolver;    // Returns whether a product is in stock.
//         BuyHandler buyHandler;                  // Returns the contract that handles orders.
//         bool isValid;                           // True if all properties are set.
//     }

//     struct Order {
//         address buyer;
//         address seller;
//         uint256 DIN;
//         uint256 amountPaid;
//         uint256 timestamp;
//     }

//     // The address of DIN registry where all product IDs are stored.
//     DINRegistry public dinRegistry;

//     // Product ID (DIN) => Product
//     mapping (uint256 => Product) products;

//     uint256 public orderIndex = 0;

//     // Order ID => Order
//     mapping (uint256 => Order) public orders;

//     // Product ID (DIN) => Pending revenue
//     mapping (uint256 => uint256) public pendingWithdrawals;

//     // Events
//     event NameChanged(uint256 indexed DIN, string name);
//     event PriceResolverChanged(uint256 indexed DIN, address PriceResolver);
//     event InventoryResolverChanged(uint256 indexed DIN, address InventoryResolver);
//     event BuyHandlerChanged(uint256 indexed DIN, address BuyHandler);

//     event NewOrder(
//         uint orderID, 
//         address indexed buyer, 
//         address indexed seller, 
//         uint256 indexed DIN, 
//         uint256 amountPaid, 
//         uint256 timestamp
//     );

//     // Interfaces
//     bytes4 constant NAME_INTERFACE_ID = 0x00ad800c; // bytes4(sha3("name(uint256)"))
//     bytes4 constant RETAIL_URL_INTERFACE_ID = 0x90af830d;
//     bytes4 constant IMAGE_URL_INTERFACE_ID = 0x4f5cad01;
//     bytes4 constant CATEGORY_INTERFACE_ID = 0x253eca1f;
//     bytes4 constant BRAND_INTERFACE_ID = 0xbedf7e19;
//     bytes4 constant MANUFACTURER_INTERFACE_ID = 0xa43271b9;
//     bytes4 constant COLOR_INTERFACE_ID = 0xd4e28c9c;
//     bytes4 constant MODEL_INTERFACE_ID = 0x4c5770d9;
//     bytes4 constant UPC_INTERFACE_ID = 0x2266a58e;
//     bytes4 constant EAN_INTERFACE_ID = 0x9b2e8e30;
//     bytes4 constant DESCRIPTION_INTERFACE_ID = 0x2c5f13e0;

//     modifier only_owner(uint256 DIN) {
//         require (dinRegistry.owner(DIN) == msg.sender);
//         _;
//     }

//     modifier only_seller(uint256 DIN) {
//         require(orders[orderID].seller == msg.sender);
//         _;
//     }

//     modifier only_correct_price(uint256 DIN, uint256 quantity) {
//         require(price(DIN) * quantity == msg.value);
//         _;
//     }

//     modifier only_in_stock(uint256 DIN, uint256 quantity) {
//         require(inStock(DIN, quantity) == true);
//         _;
//     }

//     modifier only_valid_product(uint256 DIN) {
//         require(products[DIN].isValid == true);
//         _;
//     }

//     /**
//      * Constructor.
//      * @param dinRegistryAddr The address of the DIN registry contract.
//      */
//     function PublicMarket(DINRegistry dinRegistryAddr) {
//         dinRegistry = dinRegistryAddr;
//     }

//     // This contract does not accept ether directly. Use the "buy" function to buy a product.
//     function () {
//         throw;
//     }

//     /**
//     * Returns true if the resolver implements the interface specified by the provided hash.
//     * @param interfaceID The ID of the interface to check for.
//     * @return True if the contract implements the requested interface.
//     */
//     function supportsInterface(bytes4 interfaceID) constant returns (bool) {
//         return interfaceID == NAME_INTERFACE_ID ||
//                interfaceID == RETAIL_URL_INTERFACE_ID ||
//                interfaceID == IMAGE_URL_INTERFACE_ID ||
//                interfaceID == CATEGORY_INTERFACE_ID ||
//                interfaceID == BRAND_INTERFACE_ID ||
//                interfaceID == MANUFACTURER_INTERFACE_ID ||
//                interfaceID == COLOR_INTERFACE_ID ||
//                interfaceID == MODEL_INTERFACE_ID ||
//                interfaceID == UPC_INTERFACE_ID ||
//                interfaceID == EAN_INTERFACE_ID ||
//                interfaceID == DESCRIPTION_INTERFACE_ID;
//     }

//     /**
//     *   =========================
//     *          Add Product          
//     *   =========================
//     */

//     function addProduct(
//         uint256 DIN,
//         string name, 
//         ProductInfo info, 
//         PriceResolver price, 
//         InventoryResolver inventory, 
//         BuyHandler buyHandler
//     ) {
//         products[DIN].name = name;
//         products[DIN].info = info;
//         products[DIN].price = price;
//         products[DIN].inventory = inventory;
//         products[DIN].buyHandler = buyHandler;

//         products[DIN].isValid = true
//     }

//     /**
//     *   =========================
//     *            Orders          
//     *   =========================
//     */

//     /**
//      * Buy a quantity of a product.
//      * @param DIN The DIN of the product to buy.
//      * @param quantity The quantity to buy.
//      */   
//     function buy(
//         uint256 DIN, 
//         uint256 quantity
//     ) 
//         payable 
//         only_correct_price(DIN, quantity) 
//         only_in_stock(DIN, quantity) 
//     {
//         addOrder(DIN, quantity);
//     }

//     function addOrder(uint256 DIN, uint256 quantity) private {
//         address seller = dinRegistry.owner(DIN);

//         // Increment the order index for a new order.
//         orderIndex++;

//         // Add the order to the order tracker.
//         orders[orderIndex] = Order(
//             msg.sender, 
//             seller, 
//             DIN, 
//             msg.value, 
//             block.timestamp
//         );

//         NewOrder(
//             orderIndex, 
//             msg.sender, 
//             seller, 
//             DIN, 
//             msg.value, 
//             block.timestamp
//         );

//         pendingWithdrawals[DIN] += msg.value;

//         // Call the seller's buy handler.
//         products[DIN].buyHandler.handleOrder(
//             DIN, 
//             quantity,
//             msg.sender
//         );
//     }

//     /**
//     *   Withdraw proceeds of sales.
//     */
//     function withdraw(uint256 DIN) only_owner(DIN) {
//         uint256 amount = pendingWithdrawals[DIN];
//         // Zero the pending refund before to prevent re-entrancy attacks.
//         pendingWithdrawals[DIN] = 0;
//         msg.sender.transfer(amount);
//     }

//     /**
//     *   =========================
//     *      Product Information 
//     *   =========================
//     */

//     /**
//     *   The price of the product, including all tax, shipping costs, and discounts.
//     */
//     function price(uint256 DIN) constant returns (uint256) {
//         return products[DIN].priceResolver.price(DIN, msg.sender);
//     }

//     function priceResolver(uint256 DIN) constant returns (address) {
//         return products[DIN].priceResolver;
//     }

//     function setPriceResolver(uint256 DIN, PriceResolver resolver) only_owner(DIN) {
//         products[DIN].priceResolver = resolver;
//         PriceResolverChanged(DIN, resolver);
//     }

//     function inStock(uint256 DIN, uint256 quantity) constant returns (bool) {
//         return products[DIN].inventoryResolver.inStock(DIN, quantity);
//     }

//     function inventoryResolver(uint256 DIN) constant returns (address) {
//         return products[DIN].inventoryResolver;
//     }

//     function setInventoryResolver(uint256 DIN, InventoryResolver resolver) only_owner(DIN) {
//         products[DIN].inventoryResolver = resolver;
//         InventoryResolverChanged(DIN, resolver);
//     }

//     function buyHandler(uint256 DIN) constant returns (address) {
//         return products[DIN].buyHandler;
//     }

//     function setBuyHandler(uint256 DIN, BuyHandler handler) only_owner(DIN) {
//         products[DIN].buyHandler = handler;
//         BuyHandlerChanged(DIN, handler);
//     }

// }
