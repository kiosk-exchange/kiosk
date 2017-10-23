const Checkout = artifacts.require("Checkout.sol");
const DINRegistry = artifacts.require("DINRegistry.sol");
const DINRegistrar = artifacts.require("DINRegistrar.sol");
const MarketToken = artifacts.require("MarketToken.sol");
const Promise = require("bluebird");
const chai = require("chai"),
    expect = chai.expect,
    should = chai.should();
const utils = require("web3-utils");
const BigNumber = require("bignumber.js");

contract("Checkout", accounts => {
    let checkout;
    let registry;
    let registrar;
    const alice = accounts[0];
    const bob = accounts[1];

    // Errors
    const ERROR_OFFER_EXPIRED = 0;
    const ERROR_INVALID_PRICE = 1;
    const ERROR_INSUFFICIENT_BALANCE = 2;
    const ERROR_INVALID_SIGNATURE = 3;
    const ERROR_INVALID_MERCHANT = 4;

    // Tokens
    let marketToken;
    const ether = "0x0000000000000000000000000000000000000000";

    // Addresses
    const none = "0x0000000000000000000000000000000000000000";

    // Product details
    let DIN;
    const quantity = 1;
    const price = 5 * Math.pow(10, 18); // The price of Bob's product is 5 MARKs
    const priceValidUntil = 1514160000; // Valid until 12/25/2017

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
        console.log("HELLO WORLD!")
        // http://web3js.readthedocs.io/en/1.0/web3-utils.html#soliditysha3
        const hash = utils.soliditySha3(
            DIN,
            price,
            priceCurrency,
            priceValidUntil,
            affiliateFee
        );
        console.log(hash);
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

    before(async () => {
        checkout = await Checkout.deployed();
        registry = await DINRegistry.deployed();
        registrar = await DINRegistrar.deployed();
        marketToken = await MarketToken.deployed();

        await registrar.registerDIN({ from: bob });
        DIN = await getDINFromLog();
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
        const expiredDate = 1506988800;
        const values = [DIN, quantity, new BigNumber(price), expiredDate, 0];
        const addresses = [ether, none];

        const signature = getSignature(
            DIN,
            price,
            ether,
            expiredDate,
            0,
            alice
        );
        console.log(signature);

        // const result = await checkout.buy(
        //     values,
        //     addresses,
        //     signature.v,
        //     signature.r,
        //     signature.s
        // );

        // console.log(result);

        // expect(result.logs[0].args.errorId.s.toNumber()).to.equal(ERROR_OFFER_EXPIRED);
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
    //         { from: bob } // Bob has zero Market Tokens
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

    // it("should throw if the price is zero", async () => {
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