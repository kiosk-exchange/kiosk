pragma solidity ^0.4.11;

import './DINRegistry.sol';
import './PriceResolver.sol';
import './InventoryResolver.sol';

/**
*  This is the default Kiosk implementation of a resolver contract for products.
*/
contract KioskResolver {

    struct Product {
        // Order Logic
        PriceResolver priceResolver;            // Returns the price of a given product. Required.
        InventoryResolver inventoryResolver;    // Returns whether a product is in stock. If not set, default is true.

        // Product Info (Optional)
        string name;                            // Tile Slim White - Tile Trackers & Locators
        string description;                     // Slim White. The thinnest Bluetooth tracker that finds everyday items in seconds.
        string imageURL;                        // https://static-www.thetileapp.com/images/slim_pdp_hero2.jpg
        string retailURL;                       // https://www.thetileapp.com/en-us/store/tiles/slim
        string category;                        // Cell Phone Accessories
        string brand;                           // Tile
        string manufacturer;                    // Tile
        string color;                           // White
        string model;                           // EC-04001
        uint256 UPC;                            // 859553005297
        uint256 EAN;                            // 0859553005297
    }

    struct Order {
        address buyer;
        address seller;
        uint256 productID;
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

    mapping (address => uint256) public pendingWithdrawals;

    // Events
    event PriceResolverChanged(uint256 indexed productID, address PriceResolver);
    event InventoryResolverChanged(uint256 indexed productID, address InventoryResolver);

    event NameChanged(uint256 indexed productID, string name);
    event RetailURLChanged(uint256 indexed productID, string retailURL);
    event ImageURLChanged(uint256 indexed productID, string imageURL);
    event CategoryChanged(uint256 indexed productID, string category);
    event BrandChanged(uint256 indexed productID, string brand);
    event ManufacturerChanged(uint256 indexed productID, string manufacturer);
    event ColorChanged(uint256 indexed productID, string color);
    event ModelChanged(uint256 indexed productID, string model);
    event UPCChanged(uint256 indexed productID, uint256 UPC);
    event EANChanged(uint256 indexed productID, uint256 EAN);
    event DescriptionChanged(uint indexed productID, string description);

    // Interfaces
    bytes4 constant NAME_INTERFACE_ID = 0x00ad800c; // bytes4(sha3("name(uint256)"))
    bytes4 constant RETAIL_URL_INTERFACE_ID = 0x90af830d;
    bytes4 constant IMAGE_URL_INTERFACE_ID = 0x4f5cad01;
    bytes4 constant CATEGORY_INTERFACE_ID = 0x253eca1f;
    bytes4 constant BRAND_INTERFACE_ID = 0xbedf7e19;
    bytes4 constant MANUFACTURER_INTERFACE_ID = 0xa43271b9;
    bytes4 constant COLOR_INTERFACE_ID = 0xd4e28c9c;
    bytes4 constant MODEL_INTERFACE_ID = 0x4c5770d9;
    bytes4 constant UPC_INTERFACE_ID = 0x2266a58e;
    bytes4 constant EAN_INTERFACE_ID = 0x9b2e8e30;
    bytes4 constant DESCRIPTION_INTERFACE_ID = 0x2c5f13e0;

    // Only the product owner may change product information.
    modifier only_owner(uint256 productID) {
        if (dinRegistry.owner(productID) != msg.sender) throw;
        _;
    }

    modifier only_seller(uint256 orderID) {
        if (orders[orderID].seller != msg.sender) throw;
        _;
    }

    // A product can only be purchased if the amount sent matches the price.
    modifier only_correct_price(uint256 productID) {
        if (price(productID) != msg.value) throw;
        _;
    }

    // A product can only be purchased if it is in stock.
    modifier only_in_stock(uint256 productID) {
        if (inStock(productID) != true) throw;
        _;
    }

    /**
     * Constructor.
     * @param dinRegistryAddr The address of the DIN registry contract.
     */
    function KioskResolver(DINRegistry dinRegistryAddr) {
        dinRegistry = dinRegistryAddr;
    }

    // This contract does not accept ether directly. Use the "buy" function to buy a product.
    function () {
        throw;
    }

    /**
    * Returns true if the resolver implements the interface specified by the provided hash.
    * @param interfaceID The ID of the interface to check for.
    * @return True if the contract implements the requested interface.
    */
    function supportsInterface(bytes4 interfaceID) returns (bool) {
        return interfaceID == NAME_INTERFACE_ID ||
               interfaceID == RETAIL_URL_INTERFACE_ID ||
               interfaceID == IMAGE_URL_INTERFACE_ID ||
               interfaceID == CATEGORY_INTERFACE_ID ||
               interfaceID == BRAND_INTERFACE_ID ||
               interfaceID == MANUFACTURER_INTERFACE_ID ||
               interfaceID == COLOR_INTERFACE_ID ||
               interfaceID == MODEL_INTERFACE_ID ||
               interfaceID == UPC_INTERFACE_ID ||
               interfaceID == EAN_INTERFACE_ID ||
               interfaceID == DESCRIPTION_INTERFACE_ID;
    }

    /**
    *  Buy a product.
    *  @param productID The DIN or the product to buy.
    */
    function buy(uint256 productID) payable only_correct_price(productID) only_in_stock(productID) {
        address seller = dinRegistry.owner(productID);

        // Add the order to the order tracker
        orderIndex++;
        orders[orderIndex] = Order(msg.sender, seller, productID, msg.value, block.timestamp);
        pendingWithdrawals[msg.sender] += msg.value;
    }

    /**
    *   Withdraw proceeds of sales.
    */
    function withdraw() {
        uint256 amount = pendingWithdrawals[msg.sender];
        // Zero the pending refund before to prevent re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

    /**
    *   The price of the product, including all tax, shipping costs, and discounts.
    */
    function price(uint256 productID) constant returns (uint256) {
        // Only return a price if the price calculator is set
        if (products[productID].priceResolver.initialized() == 1) {
            return products[productID].priceResolver.price(productID, msg.sender);
        }
        return 0;
    }

    function setPriceResolver(uint256 productID, PriceResolver resolver) only_owner(productID) {
        products[productID].priceResolver = resolver;
        PriceResolverChanged(productID, resolver);
    }

    function inStock(uint256 productID) constant returns (bool) {
        if (products[productID].inventoryResolver.initialized() == 1) {
            return products[productID].inventoryResolver.inStock(productID);
        }
        // If inventory resolver is not set, default is true
        return true;
    }

    function setInventoryResolver(uint256 productID, InventoryResolver resolver) only_owner(productID) {
        products[productID].inventoryResolver = resolver;
        InventoryResolverChanged(productID, resolver);
    }

    // Name
    function name(uint256 productID) constant returns (string) {
        return products[productID].name;
    }

    function setName(uint256 productID, string name) only_owner(productID) {
        products[productID].name = name;
        NameChanged(productID, name);
    }

    // RetailURL
    function retailURL(uint256 productID) constant returns (string) {
        return products[productID].retailURL;
    }

    function setRetailURL(uint256 productID, string retailURL) only_owner(productID) {
        products[productID].retailURL = retailURL;
        RetailURLChanged(productID, retailURL);
    }

    // ImageURL
    function imageURL(uint256 productID) constant returns (string) {
        return products[productID].imageURL;
    }

    function setImageURL(uint256 productID, string imageURL) only_owner(productID) {
        products[productID].imageURL = imageURL;
        ImageURLChanged(productID, imageURL);
    }

    // Category
    function category(uint256 productID) constant returns (string) {
        return products[productID].category;
    }

    function setCategory(uint256 productID, string category) only_owner(productID) {
        products[productID].category = category;
        NameChanged(productID, category);
    }

    // Brand
    function brand(uint256 productID) constant returns (string) {
        return products[productID].brand;
    }

    function setBrand(uint256 productID, string brand) only_owner(productID) {
        products[productID].brand = brand;
        BrandChanged(productID, brand);
    }

    // Manufacturer
    function manufacturer(uint256 productID) constant returns (string) {
        return products[productID].manufacturer;
    }

    function setManufacturer(uint256 productID, string manufacturer) only_owner(productID) {
        products[productID].manufacturer = manufacturer;
        ManufacturerChanged(productID, manufacturer);
    }

    // Color
    function color(uint256 productID) constant returns (string) {
        return products[productID].color;
    }

    function setColor(uint256 productID, string color) only_owner(productID) {
        products[productID].color = color;
        ColorChanged(productID, color);
    }

    // Model
    function model(uint256 productID) constant returns (string) {
        return products[productID].model;
    }

    function setModel(uint256 productID, string model) only_owner(productID) {
        products[productID].model = model;
        ColorChanged(productID, model);
    }

    // UPC
    function UPC(uint256 productID) constant returns (uint256) {
        return products[productID].UPC;
    }

    function setUPC(uint256 productID, uint256 UPC) only_owner(productID) {
        products[productID].UPC = UPC;
        UPCChanged(productID, UPC);
    }

    // EAN
    function EAN(uint256 productID) constant returns (uint256) {
        return products[productID].EAN;
    }

    function setEAN(uint256 productID, uint256 EAN) only_owner(productID) {
        products[productID].EAN = EAN;
        EANChanged(productID, EAN);
    }

    // Description
    function description(uint256 productID) constant returns (string) {
        return products[productID].description;
    }

    function setDescription(uint256 productID, string description) only_owner(productID) {
        products[productID].description = description;
        DescriptionChanged(productID, description);
    }

}
