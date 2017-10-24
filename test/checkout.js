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
    const IS_DEBUG = false; // Set to true for additional logging

    // Contracts
    let checkout;
    let registry;
    let registrar;
    let resolver;

    // Accounts
    const alice = accounts[0]; // Buyer
    const bob = accounts[1]; // Seller
    const carol = accounts[2]; // Affiliate

    // Errors
    const ERROR_OFFER_EXPIRED = "Offer expired";
    const ERROR_INVALID_PRICE = "Invalid price";
    const ERROR_INVALID_RESOLVER = "Invalid resolver";
    const ERROR_INVALID_MERCHANT = "Invalid merchant";
    const ERROR_INSUFFICIENT_BALANCE = "Insufficient balance";
    const ERROR_INVALID_SIGNATURE = "Invalid signature";

    // Tokens
    let MARKET_TOKEN_ADDRESS;
    const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

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
    const PRICE_ETHER = 5 * Math.pow(10, 17); // 0.5 ETH
    const PRICE_MARKET_TOKENS = 1 * Math.pow(10, 18); // 1 MARK

    // Affiliate Fee
    const FEE = 1 * Math.pow(10, 18); // 1 MARK
    const NO_FEE = 0;

    // Quantity
    const QUANTITY_ONE = 1;
    const QUANTITY_MANY = 17;

    // Constants
    const GAS_PRICE = web3.toWei(5, "gwei");

    const getDINFromLog = async () => {
        const registrationEvent = registry.NewRegistration({ owner: bob });
        const eventAsync = Promise.promisifyAll(registrationEvent);
        const logs = await eventAsync.getAsync();

        const DIN = parseInt(logs[0]["args"]["DIN"]);
        return DIN;
    };

    const getHash = values => {
        if (IS_DEBUG === true) {
            console.log("VALUES: " + values);
        }
        // http://web3js.readthedocs.io/en/1.0/web3-utils.html#soliditysha3
        const hash = utils.soliditySha3(...values);
        return hash;
    };

    const getSignature = (values, account = bob) => {
        const hash = getHash(values);
        if (IS_DEBUG === true) {
            console.log("HASH: " + hash);
        }

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

        if (IS_DEBUG === true) {
            console.log("SIGNATURE: " + signature);
        }

        return signature;
    };

    const getBuyResult = async (
        values,
        addresses,
        owner = bob,
        buyer = alice
    ) => {
        // DIN, price, priceCurrency, priceValidUntil, affiliateFee
        const hashValues = [
            values[0],
            values[2],
            addresses[0],
            values[3],
            values[4]
        ];
        const signature = getSignature(hashValues, owner);

        let value = 0;

        if (addresses[0] === ETHER_ADDRESS) {
            value = values[2]; // Price
        }

        const result = await checkout.buy(
            values,
            addresses,
            signature.v,
            signature.r,
            signature.s,
            {
                from: buyer,
                value: value,
                gasPrice: GAS_PRICE
            }
        );

        return result;
    };

    before(async () => {
        checkout = await Checkout.deployed();
        registry = await DINRegistry.deployed();
        registrar = await DINRegistrar.deployed();
        marketToken = await MarketToken.deployed();
        resolver = await PublicURLResolver.deployed();

        MARKET_TOKEN_ADDRESS = marketToken.address;

        // Register 3 DINs.
        await registrar.registerDINs(3, { from: bob });

        // Set the resolver for the first two DINs.
        await registry.setResolver(DIN, resolver.address, { from: bob });
        await registry.setResolver(DIN_NO_MERCHANT, resolver.address, {
            from: bob
        });

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
        const values = [DIN, QUANTITY_ONE, PRICE_ETHER, EXPIRED_DATE, NO_FEE];
        const addresses = [ETHER_ADDRESS, NO_AFFILIATE];

        const result = await getBuyResult(values, addresses);
        expect(result.logs[0].args.error).to.equal(ERROR_OFFER_EXPIRED);
    });

    it("should log an error if the price is zero", async () => {
        const values = [DIN, QUANTITY_ONE, 0, FUTURE_DATE, NO_FEE];
        const addresses = [ETHER_ADDRESS, NO_AFFILIATE];

        const result = await getBuyResult(values, addresses);
        expect(result.logs[0].args.error).to.equal(ERROR_INVALID_PRICE);
    });

    it("should log an error if the resolver is not set", async () => {
        const values = [
            DIN_NO_RESOLVER,
            QUANTITY_ONE,
            PRICE_ETHER,
            FUTURE_DATE,
            NO_FEE
        ];
        const addresses = [ETHER_ADDRESS, NO_AFFILIATE];

        const result = await getBuyResult(values, addresses);
        expect(result.logs[0].args.error).to.equal(ERROR_INVALID_RESOLVER);
    });

    it("should log an error if the merchant is not set", async () => {
        const values = [
            DIN_NO_MERCHANT,
            QUANTITY_ONE,
            PRICE_ETHER,
            FUTURE_DATE,
            NO_FEE
        ];
        const addresses = [ETHER_ADDRESS, NO_AFFILIATE];

        const result = await getBuyResult(values, addresses);
        expect(result.logs[0].args.error).to.equal(ERROR_INVALID_MERCHANT);
    });

    it("should log an error if the signature is invalid", async () => {
        const values = [DIN, QUANTITY_ONE, PRICE_ETHER, FUTURE_DATE, NO_FEE];
        const addresses = [ETHER_ADDRESS, NO_AFFILIATE];

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
        const values = [DIN, QUANTITY_ONE, PRICE_ETHER, FUTURE_DATE, NO_FEE];
        const addresses = [ETHER_ADDRESS, NO_AFFILIATE];

        const signature = getSignature(values, bob);

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

    it("should validate a signature", async () => {
        const values = [DIN, QUANTITY_ONE, PRICE_ETHER, FUTURE_DATE, NO_FEE];
        const address = [ETHER_ADDRESS, NO_AFFILIATE];
        const hashValues = [
            DIN,
            PRICE_ETHER,
            ETHER_ADDRESS,
            FUTURE_DATE,
            NO_FEE
        ];

        const signature = getSignature(hashValues);
        const hash = getHash(hashValues);

        const result = await checkout.isValidSignature(
            bob,
            hash,
            signature.v,
            signature.r,
            signature.s
        );
        expect(result).to.equal(true);

        const fakeValues = [DIN, 1, ETHER_ADDRESS, FUTURE_DATE, NO_FEE];
        const fakeHash = getHash(fakeValues);
        const fakeResult = await checkout.isValidSignature(
            bob,
            fakeHash,
            signature.v,
            signature.r,
            signature.s
        );
        expect(fakeResult).to.equal(false);
    });

    it("should process a valid purchase with Ether", async () => {
        const values = [DIN, QUANTITY_ONE, PRICE_ETHER, FUTURE_DATE, NO_FEE];
        const addresses = [ETHER_ADDRESS, NO_AFFILIATE];

        const beginIndex = await checkout.orderIndex();
        const beginBalanceBuyer = await web3.eth.getBalance(alice);
        const beginBalanceMerchant = await web3.eth.getBalance(bob);

        const result = await getBuyResult(values, addresses);
        const gasUsed = result.receipt.gasUsed;

        const endIndex = await checkout.orderIndex();
        expect(endIndex.toNumber()).to.equal(beginIndex.toNumber() + 1);

        const endBalanceBuyer = await web3.eth.getBalance(alice);
        const endBalanceMerchant = await web3.eth.getBalance(bob);

        const expectedBuyer =
            beginBalanceBuyer.toNumber() - gasUsed * GAS_PRICE - PRICE_ETHER;
        const expectedMerchant = beginBalanceMerchant.toNumber() + PRICE_ETHER;

        expect(endBalanceBuyer.toNumber()).to.equal(expectedBuyer);
        expect(endBalanceMerchant.toNumber()).to.equal(expectedMerchant);
    });

    it("should process a valid purchase with Market Tokens", async () => {
        const values = [
            DIN,
            QUANTITY_ONE,
            PRICE_MARKET_TOKENS,
            FUTURE_DATE,
            NO_FEE
        ];
        const addresses = [MARKET_TOKEN_ADDRESS, NO_AFFILIATE];

        const beginIndex = await checkout.orderIndex();
        const beginBalanceBuyer = await marketToken.balanceOf(alice);
        const beginBalanceMerchant = await marketToken.balanceOf(bob);

        const result = await getBuyResult(values, addresses);

        const endIndex = await checkout.orderIndex();
        expect(endIndex.toNumber()).to.equal(beginIndex.toNumber() + 1);

        const endBalanceBuyer = await marketToken.balanceOf(alice);
        const endBalanceMerchant = await marketToken.balanceOf(bob);

        const expectedBuyer = beginBalanceBuyer.toNumber() - PRICE_MARKET_TOKENS;
        const expectedMerchant = beginBalanceMerchant.toNumber() + PRICE_MARKET_TOKENS;

        expect(endBalanceBuyer.toNumber()).to.equal(expectedBuyer);
        expect(endBalanceMerchant.toNumber()).to.equal(expectedMerchant);
    });

    // Throw if not enough tokens
});