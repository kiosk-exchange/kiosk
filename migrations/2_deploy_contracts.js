const web3 = new (require("web3"))();
const DINRegistry = artifacts.require("DINRegistry.sol");
const OrderTracker = artifacts.require("OrderTracker.sol");
const DINMarket = artifacts.require("DIN/DINMarket.sol");
const ENSMarket = artifacts.require("ENSMarket/ENSMarket.sol");
const ENSPublicProduct = artifacts.require("ENSMarket/ENSPublicProduct.sol");
const ENS = artifacts.require("ENSMarket/ENS/ENS.sol");
const FIFSRegistrar = artifacts.require("ENSMarket/ENS/FIFSRegistrar.sol");
const KioskMarketToken = artifacts.require("Token/KioskMarketToken.sol");
const TokenMarket = artifacts.require("Token/TokenMarket.sol");
const TokenPublicProduct = artifacts.require("Token/TokenPublicProduct.sol");
const namehash = require("../node_modules/eth-ens-namehash");

// https://github.com/ethereum/ens/blob/master/migrations/2_deploy_contracts.js

/**
 * Calculate root node hashes given the top level domain(tld)
 * @param {string} tld plain text tld, for example: 'eth'
 */
function getRootNodeFromTLD(tld) {
  return {
    namehash: namehash(tld),
    sha3: web3.sha3(tld)
  };
}

module.exports = function(deployer, network, accounts) {
  const tld = "eth";
  const rootNode = getRootNodeFromTLD(tld);
  const subnodeSHA3 = web3.sha3("example");
  const subnodeName = "example.eth";
  const subnodeNameHash = namehash(subnodeName);
  const price = web3.toWei(2, "ether");
  const initialSupply = 1000000; // Initialize KMT with 1 million tokens
  const genesis = 1000000000;
  const ENSDIN = 1000000001; // The first DIN registered (used for demo ENS product)
  const tokenDIN = 1000000002; // The second DIN registered (used for demo token product)
  const account1 = accounts[0];

  /**
    *   =========================
    *        Kiosk Protocol         
    *   =========================
    */

  // Deploy Kiosk Market Token with a total supply of 1 million tokens.
  deployer
    .deploy(KioskMarketToken, initialSupply)
    .then(() => {
      // Deploy DINRegistry with a genesis DIN of 10000000000.
      return deployer.deploy(DINRegistry, genesis);
    })
    .then(() => {
      // Deploy OrderTracker and bind it with DINRegistry and Kiosk Market Token.
      return deployer.deploy(
        OrderTracker,
        DINRegistry.address,
        KioskMarketToken.address
      );
    })
    .then(() => {
      // Add DINRegistry to Kiosk Market Token.
      return KioskMarketToken.at(KioskMarketToken.address).setDINRegistry(
        DINRegistry.address
      );
    })
    .then(() => {
      // Add OrderTracker to Kiosk Market Token.
      return KioskMarketToken.at(KioskMarketToken.address).setOrderTracker(
        OrderTracker.address
      );
    })
    /**
      *   =========================
      *              ENS
      *   =========================
      */

    .then(() => {
      return deployer.deploy(ENS);
    })
    .then(() => {
      // Deploy the FIFSRegistrar and bind it with ENS
      return deployer.deploy(FIFSRegistrar, ENS.address, rootNode.namehash);
    })
    .then(() => {
      // Transfer the owner of the `rootNode` to the FIFSRegistrar
      return ENS.at(ENS.address).setSubnodeOwner(
        "0x0",
        rootNode.sha3,
        FIFSRegistrar.address
      );
    })
    .then(() => {
      // Register "example.eth" to a test account
      return FIFSRegistrar.at(FIFSRegistrar.address).register(
        subnodeSHA3,
        account1
      );
    })
    .then(() => {
      // Deploy ENS Market, where ENS domains can be bought and sold
      return deployer.deploy(
        ENSMarket,
        DINRegistry.address,
        OrderTracker.address,
        KioskMarketToken.address,
        ENS.address
      );
    })
    .then(() => {
      return deployer.deploy(
        ENSPublicProduct,
        DINRegistry.address,
        ENSMarket.address,
        ENS.address
      );
    })
    .then(() => {
      /**
      *   =========================
      *              DIN
      *   =========================
      */

      // Deploy the DINMarket
      return deployer.deploy(
        DINMarket,
        DINRegistry.address,
        OrderTracker.address,
        KioskMarketToken.address
      );
    })
    .then(() => {
      // Set the market for the genesis DIN to the DINMarket
      return DINRegistry.at(DINRegistry.address).setMarket(
        genesis,
        DINMarket.address
      );
    })
    .then(() => {
      // Register two new DINs (one for a demo ENS domain and one for a demo token ask offer).
      return KioskMarketToken.at(KioskMarketToken.address).buy(genesis, 1, 0);
    })
    .then(() => {
      // Set the market for the ENS DIN to the ENSMarket
      return DINRegistry.at(DINRegistry.address).setMarket(
        ENSDIN,
        ENSMarket.address
      );
    })
    .then(() => {
      // Add resolvers for ENS DIN to ENSMarket
      return ENSMarket.at(ENSMarket.address).setProduct(
        ENSDIN,
        ENSPublicProduct.address,
        ENSPublicProduct.address,
        ENSPublicProduct.address
      );
    })
    .then(() => {
      // TODO: Figure out a better way to do this
      // Set market specific information for ENS
      return ENSMarket.at(ENSMarket.address).setName(ENSDIN, subnodeName);
    })
    .then(() => {
      // TODO: Figure out a better way to do this
      // Set market specific information for ENS
      return ENSMarket.at(ENSMarket.address).setENSNode(
        ENSDIN,
        subnodeNameHash
      );
    })
    .then(() => {
      // List "example.eth" on ENSMarket
      return ENSPublicProduct.at(ENSPublicProduct.address).addENSDomain(
        ENSDIN,
        subnodeName,
        subnodeNameHash,
        price
      );
    })
    .then(() => {
      // Transfer ownership of "example.eth" to the ENSPublicProduct
      return ENS.at(ENS.address).setOwner(
        subnodeNameHash,
        ENSPublicProduct.address
      );
    })
};