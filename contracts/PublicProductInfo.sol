import './ProductInfo.sol';
import './DINRegistry.sol';

pragma solidity ^0.4.11;

/**
*  This is a public product info resolver.
*/
// contract PublicProductInfo is ProductInfo {

	// struct ProductInfo {
 //        string description;                     // Slim White. The thinnest Bluetooth tracker that finds everyday items in seconds.
 //        string imageURL;                        // https://static-www.thetileapp.com/images/slim_pdp_hero2.jpg
 //        string retailURL;                       // https://www.thetileapp.com/en-us/store/tiles/slim
 //        string category;                        // Cell Phone Accessories
 //        string brand;                           // Tile
 //        string manufacturer;                    // Tile
 //        string color;                           // White
 //        string model;                           // EC-04001
 //        uint256 UPC;                            // 859553005297
 //        uint256 EAN;                            // 0859553005297
	// }

 //    // The address of DIN registry where all product IDs are stored.
 //    DINRegistry public dinRegistry;

 //    // Product ID (DIN) => ProductInfo
 //    mapping (uint256 => ProductInfo) products;

 //    // Interfaces
 //    bytes4 constant NAME_INTERFACE_ID = 0x00ad800c; // bytes4(sha3("name(uint256)"))
 //    bytes4 constant RETAIL_URL_INTERFACE_ID = 0x90af830d;
 //    bytes4 constant IMAGE_URL_INTERFACE_ID = 0x4f5cad01;
 //    bytes4 constant CATEGORY_INTERFACE_ID = 0x253eca1f;
 //    bytes4 constant BRAND_INTERFACE_ID = 0xbedf7e19;
 //    bytes4 constant MANUFACTURER_INTERFACE_ID = 0xa43271b9;
 //    bytes4 constant COLOR_INTERFACE_ID = 0xd4e28c9c;
 //    bytes4 constant MODEL_INTERFACE_ID = 0x4c5770d9;
 //    bytes4 constant UPC_INTERFACE_ID = 0x2266a58e;
 //    bytes4 constant EAN_INTERFACE_ID = 0x9b2e8e30;
 //    bytes4 constant DESCRIPTION_INTERFACE_ID = 0x2c5f13e0;

 //    // Events
	// event RetailURLChanged(uint256 indexed productID, string retailURL);
 //    event ImageURLChanged(uint256 indexed productID, string imageURL);
 //    event CategoryChanged(uint256 indexed productID, string category);
 //    event BrandChanged(uint256 indexed productID, string brand);
 //    event ManufacturerChanged(uint256 indexed productID, string manufacturer);
 //    event ColorChanged(uint256 indexed productID, string color);
 //    event ModelChanged(uint256 indexed productID, string model);
 //    event UPCChanged(uint256 indexed productID, uint256 UPC);
 //    event EANChanged(uint256 indexed productID, uint256 EAN);
 //    event DescriptionChanged(uint indexed productID, string description);

 //    /**
 //    * Returns true if the resolver implements the interface specified by the provided hash.
 //    * @param interfaceID The ID of the interface to check for.
 //    * @return True if the contract implements the requested interface.
 //    */
 //    function supportsInterface(bytes4 interfaceID) constant returns (bool) {
 //        return interfaceID == NAME_INTERFACE_ID ||
 //               interfaceID == RETAIL_URL_INTERFACE_ID ||
 //               interfaceID == IMAGE_URL_INTERFACE_ID ||
 //               interfaceID == CATEGORY_INTERFACE_ID ||
 //               interfaceID == BRAND_INTERFACE_ID ||
 //               interfaceID == MANUFACTURER_INTERFACE_ID ||
 //               interfaceID == COLOR_INTERFACE_ID ||
 //               interfaceID == MODEL_INTERFACE_ID ||
 //               interfaceID == UPC_INTERFACE_ID ||
 //               interfaceID == EAN_INTERFACE_ID ||
 //               interfaceID == DESCRIPTION_INTERFACE_ID;
 //    }

 //    modifier only_owner(uint256 DIN) {
 //        require (dinRegistry.owner(DIN) == msg.sender);
 //        _;
 //    }

 //    *
 //     * Constructor.
 //     * @param dinRegistryAddr The address of the DIN registry contract.
     
 //    function PublicProductInfo(DINRegistry dinRegistryAddr) {
 //        dinRegistry = dinRegistryAddr;
 //    }

 //    // Name
 //    function name(uint256 DIN) constant returns (uint256) {
 //        return products[DIN].name;
 //    }

 //    function setName(uint256 DIN, string name) only_owner(DIN) {
 //        products[DIN].name = name;
 //    }

 //    // RetailURL
 //    function retailURL(uint256 productID) constant returns (string) {
 //        return products[productID].retailURL;
 //    }

 //    function setRetailURL(uint256 productID, string retailURL) only_owner(productID) {
 //        products[productID].retailURL = retailURL;
 //        RetailURLChanged(productID, retailURL);
 //    }

 //    // ImageURL
 //    function imageURL(uint256 productID) constant returns (string) {
 //        return products[productID].imageURL;
 //    }

 //    function setImageURL(uint256 productID, string imageURL) only_owner(productID) {
 //        products[productID].imageURL = imageURL;
 //        ImageURLChanged(productID, imageURL);
 //    }

 //    // Category
 //    function category(uint256 productID) constant returns (string) {
 //        return products[productID].category;
 //    }

 //    function setCategory(uint256 productID, string category) only_owner(productID) {
 //        products[productID].category = category;
 //    }

 //    // Brand
 //    function brand(uint256 productID) constant returns (string) {
 //        return products[productID].brand;
 //    }

 //    function setBrand(uint256 productID, string brand) only_owner(productID) {
 //        products[productID].brand = brand;
 //        BrandChanged(productID, brand);
 //    }

 //    // Manufacturer
 //    function manufacturer(uint256 productID) constant returns (string) {
 //        return products[productID].manufacturer;
 //    }

 //    function setManufacturer(uint256 productID, string manufacturer) only_owner(productID) {
 //        products[productID].manufacturer = manufacturer;
 //        ManufacturerChanged(productID, manufacturer);
 //    }

 //    // Color
 //    function color(uint256 productID) constant returns (string) {
 //        return products[productID].color;
 //    }

 //    function setColor(uint256 productID, string color) only_owner(productID) {
 //        products[productID].color = color;
 //        ColorChanged(productID, color);
 //    }

 //    // Model
 //    function model(uint256 productID) constant returns (string) {
 //        return products[productID].model;
 //    }

 //    function setModel(uint256 productID, string model) only_owner(productID) {
 //        products[productID].model = model;
 //        ColorChanged(productID, model);
 //    }

 //    // UPC
 //    function UPC(uint256 productID) constant returns (uint256) {
 //        return products[productID].UPC;
 //    }

 //    function setUPC(uint256 productID, uint256 UPC) only_owner(productID) {
 //        products[productID].UPC = UPC;
 //        UPCChanged(productID, UPC);
 //    }

 //    // EAN
 //    function EAN(uint256 productID) constant returns (uint256) {
 //        return products[productID].EAN;
 //    }

 //    function setEAN(uint256 productID, uint256 EAN) only_owner(productID) {
 //        products[productID].EAN = EAN;
 //        EANChanged(productID, EAN);
 //    }

 //    // Description
 //    function description(uint256 productID) constant returns (string) {
 //        return products[productID].description;
 //    }

 //    function setDescription(uint256 productID, string description) only_owner(productID) {
 //        products[productID].description = description;
 //        DescriptionChanged(productID, description);
 //    }

// }