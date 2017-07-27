import './ProductInfo.sol';

pragma solidity ^0.4.11;

/**
*  This is a public product info resolver.
*/
contract PublicProductInfo is ProductInfo {

	struct ProductInfo {
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

    // Events
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

    modifier only_owner(uint256 DIN) {
        require (dinRegistry.owner(DIN) == msg.sender);
        _;
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