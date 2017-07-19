pragma solidity ^0.4.11;

import './DINRegistry.sol';

/**
*  This is a public resolver that supports the Product interface.
*/
contract PublicProductResolver {

    // bytes4(sha3("name(uint)", "retailURL(uint)", ..., "description(uint)"))
    bytes4 public resolverInterface = 0x4c831a1f;

    // Interfaces
    bytes4 constant NAME_INTERFACE_ID = 0x00ad800c; // bytes4(sha3("name(uint)"))
    bytes4 constant RETAIL_URL_INTERFACE_ID = 0x90af830d;
    bytes4 constant IMAGE_URL_INTERFACE_ID = 0x4f5cad01;
    bytes4 constant CATEGORY_INTERFACE_ID = 0x253eca1f;
    bytes4 constant BRAND_INTERFACE_ID = 0xbedf7e19;
    bytes4 constant MANUFACTURER_INTERFACE_ID = 0xa43271b9;
    bytes4 constant COLOR_INTERFACE_ID = 0xd4e28c9c;
    bytes4 constant MODEL_INTERFACE_ID = 0x4c5770d9;
    bytes4 constant UPC_INTERFACE_ID = 0x2266a58e;
    bytes4 constant EAN_INTERFACE_ID = 0x9b2e8e3;
    bytes4 constant DESCRIPTION_INTERFACE_ID = 0x2c5f13e;

    struct Product {
        string name;            // Tile Slim White - Tile Trackers & Locators
        string retailURL;       // https://www.thetileapp.com/en-us/store/tiles/slim
        string imageURL;        // https://static-www.thetileapp.com/images/slim_pdp_hero2.jpg
        string category;        // Cell Phone Accessories
        string brand;           // Tile
        string manufacturer;    // Tile
        string color;           // White
        string model;           // EC-04001
        uint UPC;               // 859553005297
        uint EAN;               // 0859553005297
        string description;     // Slim White. The thinnest Bluetooth tracker that finds everyday items in seconds.
    }

    DINRegistry public dinRegistry;

    // ProductID (DIN) => Product
    mapping (uint => Product) products;

    // Events
    event NameChanged(uint indexed productID, string name);
    event RetailURLChanged(uint indexed productID, string retailURL);
    event ImageURLChanged(uint indexed productID, string imageURL);
    event CategoryChanged(uint indexed productID, string category);
    event BrandChanged(uint indexed productID, string brand);
    event ManufacturerChanged(uint indexed productID, string manufacturer);
    event ColorChanged(uint indexed productID, string color);
    event ModelChanged(uint indexed productID, string model);
    event UPCChanged(uint indexed productID, uint UPC);
    event EANChanged(uint indexed productID, uint EAN);
    event DescriptionChanged(uint indexed productID, string description);

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

    // Only the product owner may change product information
    modifier only_owner(uint productID) {
        if (dinRegistry.owner(productID) != msg.sender) throw;
        _;
    }

    /**
     * Constructor.
     * @param dinRegistryAddr The address of the DIN registry contract.
     */
    function PublicProductResolver(DINRegistry dinRegistryAddr) {
        dinRegistry = dinRegistryAddr;
    }

    // Name
    function name(uint productID) constant returns (string) {
        return products[productID].name;
    }

    function setName(uint productID, string name) only_owner(productID) {
        products[productID].name = name;
        NameChanged(productID, name);
    }

    // RetailURL
    function retailURL(uint productID) constant returns (string) {
        return products[productID].retailURL;
    }

    function setRetailURL(uint productID, string retailURL) only_owner(productID) {
        products[productID].retailURL = retailURL;
        RetailURLChanged(productID, retailURL);
    }

    // ImageURL
    function imageURL(uint productID) constant returns (string) {
        return products[productID].imageURL;
    }

    function setImageURL(uint productID, string imageURL) only_owner(productID) {
        products[productID].imageURL = imageURL;
        ImageURLChanged(productID, imageURL);
    }

    // Category
    function category(uint productID) constant returns (string) {
        return products[productID].category;
    }

    function setCategory(uint productID, string category) only_owner(productID) {
        products[productID].category = category;
        NameChanged(productID, category);
    }

    // Brand
    function brand(uint productID) constant returns (string) {
        return products[productID].brand;
    }

    function setBrand(uint productID, string brand) only_owner(productID) {
        products[productID].brand = brand;
        BrandChanged(productID, brand);
    }

    // Manufacturer
    function manufacturer(uint productID) constant returns (string) {
        return products[productID].manufacturer;
    }

    function setManufacturer(uint productID, string manufacturer) only_owner(productID) {
        products[productID].manufacturer = manufacturer;
        ManufacturerChanged(productID, manufacturer);
    }

    // Color
    function color(uint productID) constant returns (string) {
        return products[productID].color;
    }

    function setColor(uint productID, string color) only_owner(productID) {
        products[productID].color = color;
        ColorChanged(productID, color);
    }

    // Model
    function model(uint productID) constant returns (string) {
        return products[productID].model;
    }

    function setModel(uint productID, string model) only_owner(productID) {
        products[productID].model = model;
        ColorChanged(productID, model);
    }

    // UPC
    function UPC(uint productID) constant returns (uint) {
        return products[productID].UPC;
    }

    function setUPC(uint productID, uint UPC) only_owner(productID) {
        products[productID].UPC = UPC;
        UPCChanged(productID, UPC);
    }

    // EAN
    function EAN(uint productID) constant returns (uint) {
        return products[productID].EAN;
    }

    function setEAN(uint productID, uint EAN) only_owner(productID) {
        products[productID].EAN = EAN;
        EANChanged(productID, EAN);
    }

    // Description
    function description(uint productID) constant returns (string) {
        return products[productID].description;
    }

    function setDescription(uint productID, string description) only_owner(productID) {
        products[productID].description = description;
        DescriptionChanged(productID, description);
    }

}
