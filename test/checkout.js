const Checkout = artifacts.require("Checkout.sol");
const DINRegistry = artifacts.require("DINRegistry.sol");
const DINRegistrar = artifacts.require("DINRegistrar.sol");
const MarketToken = artifacts.require("MarketToken.sol");
const PublicURLResolver = artifacts.require("PublicURLResolver.sol");
const Promise = require("bluebird");
const chai = require("chai"),
    expect = chai.expect,
    should = chai.should();
const utils = require("web3-utils");
const BigNumber = require("bignumber.js");

contract("Checkout", accounts => {
    // Contracts
    let checkout;
    let registry;
    let registrar;
    let resolver;

    // Accounts
    const alice = accounts[0];
    const bob = accounts[1];

    // Errors
    const ERROR_OFFER_EXPIRED = "Offer expired";
    const ERROR_INVALID_PRICE = "Invalid price";
    const ERROR_INVALID_RESOLVER = "Invalid resolver";
    const ERROR_INVALID_MERCHANT = "Invalid merchant";
    const ERROR_INSUFFICIENT_BALANCE = "Insufficient balance";
    const ERROR_INVALID_SIGNATURE = "Invalid signature";

    // Tokens
    let MARKET_TOKEN;
    const ETHER = "0x0000000000000000000000000000000000000000";

    // Addresses
    const NO_AFFILIATE = "0x0000000000000000000000000000000000000000";

    // DINs
    const DIN = 1000000001;
    const DIN_NO_MERCHANT = 1000000002;
    const DIN_NO_RESOLVER = 1000000003;

    // Price valid until
    const FUTURE_DATE = 1577836800; // 1/1/2020
    const EXPIRED_DATE = 1483228800; // 1/1/2017

    // Price
    const PRICE = 5 * Math.pow(10, 18);

    // Affiliate Fee
    const NO_FEE = 0;

    // Quantity
    const QUANTITY_ONE = 1;
    const QUANTITY_MANY = 17;

    let hash;
    let ecSignature = {};

    const getDINFromLog = async () => {
        const registrationEvent = registry.NewRegistration({ owner: bob });
        const eventAsync = Promise.promisifyAll(registrationEvent);
        const logs = await eventAsync.getAsync();

        const DIN = parseInt(logs[0]["args"]["DIN"]);
        return DIN;
    };

    const getSignature = (
        DIN,
        price,
        priceCurrency,
        priceValidUntil,
        affiliateFee,
        account
    ) => {
        // http://web3js.readthedocs.io/en/1.0/web3-utils.html#soliditysha3
        const hash = utils.soliditySha3(
            DIN,
            price,
            priceCurrency,
            priceValidUntil,
            affiliateFee
        );
        const signedMessage = web3.eth.sign(account, hash);

        // https://ethereum.stackexchange.com/questions/1777/workflow-on-signing-a-string-with-private-key-followed-by-signature-verificatio/1794#1794
        const v = "0x" + signedMessage.slice(130, 132);
        const r = signedMessage.slice(0, 66);
        const s = "0x" + signedMessage.slice(66, 130);

        const signature = {
            v: web3.toDecimal(v) + 27,
            r: r,
            s: s
        };
        return signature;
    };

    const getSignatureFromValues = (values, owner) => {
        const signature = getSignature(
            values[0], // DIN
            values[1], // Quantity
            values[2], // Price
            values[3], // Expiration
            values[4], // Affiliate fee
            owner 
        );
        return signature;
    }

    const getBuyResult = async (values, addresses, owner = bob, buyer = alice) => {
        const signature = getSignatureFromValues(values, owner);

        // console.log(signature);
        
        const result = await checkout.buy(
            values,
            addresses,
            signature.v,
            signature.r,
            signature.s,
            { from: buyer }
        );

        return result;
    }

    before(async () => {
        checkout = await Checkout.deployed();
        registry = await DINRegistry.deployed();
        registrar = await DINRegistrar.deployed();
        marketToken = await MarketToken.deployed();
        resolver = await PublicURLResolver.deployed();

        // Register 3 DINs.
        await registrar.registerDINs(3, { from: bob });

        // Set the resolver for the first two DINs.
        await registry.setResolver(DIN, resolver.address, { from: bob });
        await registry.setResolver(DIN_NO_MERCHANT, resolver.address, { from: bob });

        // Set the merchant for the first DIN. Bob is the DIN owner and merchant.
        await resolver.setMerchant(DIN, bob, { from: bob });
    });

    it("should have the correct registry", async () => {
        const checkoutRegistry = await checkout.registry();
        expect(checkoutRegistry).to.equal(registry.address);
    });

    it("should have the correct token", async () => {
        const checkoutToken = await checkout.marketToken();
        expect(checkoutToken).to.equal(marketToken.address);
    });

    it("should log an error if the expiration time has passed", async () => {
        const values = [DIN, QUANTITY_ONE, PRICE, EXPIRED_DATE, NO_FEE];
        const addresses = [ETHER, NO_AFFILIATE];

        const result = await getBuyResult(values, addresses);
        expect(result.logs[0].args.error).to.equal(ERROR_OFFER_EXPIRED);
    });

    it("should log an error if the price is NO", async () => {
        const values = [DIN, QUANTITY_ONE, 0, FUTURE_DATE, NO_FEE];
        const addresses = [ETHER, NO_AFFILIATE];

        const result = await getBuyResult(values, addresses);
        expect(result.logs[0].args.error).to.equal(ERROR_INVALID_PRICE);        
    });

    it("should log an error if the resolver is not set", async () => {
        const values = [DIN_NO_RESOLVER, QUANTITY_ONE, PRICE, FUTURE_DATE, NO_FEE];
        const addresses = [ETHER, NO_AFFILIATE];

        const result = await getBuyResult(values, addresses);
        expect(result.logs[0].args.error).to.equal(ERROR_INVALID_RESOLVER);  
    });

    it("should log an error if the merchant is not set", async () => {
        const values = [DIN_NO_MERCHANT, QUANTITY_ONE, PRICE, FUTURE_DATE, NO_FEE];
        const addresses = [ETHER, NO_AFFILIATE];

        const result = await getBuyResult(values, addresses);
        expect(result.logs[0].args.error).to.equal(ERROR_INVALID_MERCHANT);        
    });

    it("should log an error if the signature is invalid", async () => {
        const values = [DIN, QUANTITY_ONE, PRICE, FUTURE_DATE, NO_FEE];
        const addresses = [ETHER, NO_AFFILIATE];

        const result = await checkout.buy(
            values,
            addresses,
            27,
            "0x0000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000"
        );
        expect(result.logs[0].args.error).to.equal(ERROR_INVALID_SIGNATURE);        
    });

    it("should log an error if the price does not match the signed price", async () => {
        const values = [DIN, QUANTITY_ONE, PRICE, FUTURE_DATE, NO_FEE];
        const addresses = [ETHER, NO_AFFILIATE];

        const signature = getSignatureFromValues(values, bob);

        // Set the price low to try to get the item for less
        const fakeValues = [DIN, QUANTITY_ONE, 1, FUTURE_DATE, NO_FEE];

        const result = await checkout.buy(
            fakeValues,
            addresses,
            signature.v,
            signature.r,
            signature.s
        );
        expect(result.logs[0].args.error).to.equal(ERROR_INVALID_SIGNATURE);   
    });

    it("should process a valid purchase with Ether", async () => {
        const values = [DIN, QUANTITY_ONE, PRICE, FUTURE_DATE, NO_FEE];
        const addresses = [ETHER, NO_AFFILIATE];

        const result = await getBuyResult(values, addresses);
        console.log(result.logs[0].args);
    });

    // it("should throw if the user does not have enough tokens for a purchase", async () => {
    //     const result = await checkout.buy(
    //         DIN,
    //         quantity,
    //         price,
    //         priceValidUntil,
    //         ecSignature.v,
    //         ecSignature.r,
    //         ecSignature.s,
    //         { from: bob } // Bob has NO Market Tokens
    //     );
    //     expect(result.logs[0].args.errorId.s).to.equal(1);
    // });

    // it("should throw if the expired time has passed", async () => {
    //     const result = await checkout.buy(
    //         DIN,
    //         quantity,
    //         price,
    //         1506988800, // 10/03/17
    //         ecSignature.v,
    //         ecSignature.r,
    //         ecSignature.s,
    //         { from: alice }
    //     );
    //     expect(result.logs[0].event).to.equal("LogError");
    // });

    // it("should throw if the price is NO", async () => {
    //     const result = await checkout.buy(
    //         DIN,
    //         quantity,
    //         0,
    //         priceValidUntil,
    //         ecSignature.v,
    //         ecSignature.r,
    //         ecSignature.s,
    //         { from: alice }
    //     );
    //     expect(result.logs[0].event).to.equal("LogError");
    // });

    // it("should validate a signature", async () => {
    //     const valid = await checkout.isValidSignature(
    //         bob,
    //         hash,
    //         ecSignature.v,
    //         ecSignature.r,
    //         ecSignature.s
    //     );
    //     expect(valid).to.equal(true);

    //     const invalid = await checkout.isValidSignature(
    //         bob,
    //         hash,
    //         26,
    //         ecSignature.r,
    //         ecSignature.s
    //     );
    //     expect(invalid).to.equal(false);
    // });

    // it("should allow a purchase with valid parameters", async() => {
    //     const orderIndex = await checkout.orderIndex();
    //     expect(orderIndex.toNumber()).to.equal(0);

    //     const owner = await registry.owner(DIN);
    //     expect(owner).to.equal(bob);

    //     const result = await checkout.buy(
    //         DIN,
    //         quantity,
    //         price,
    //         priceValidUntil,
    //         ecSignature.v,
    //         ecSignature.r,
    //         ecSignature.s,
    //         { from: alice }
    //     );

    //     const newIndex = await checkout.orderIndex();
    //     expect(newIndex.toNumber()).to.equal(1);
    // });
});