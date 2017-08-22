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

const deployKiosk = async (deployer, network, accounts) => {
  // Deploy DINRegistry with a genesis DIN of 10000000000.
  await deployer.deploy(DINRegistry, genesis);

  // Deploy OrderTracker and bind it with DINRegistry and Kiosk Market Token.
  await deployer.deploy(
    OrderTracker,
    DINRegistry.address,
    KioskMarketToken.address
  );
  // Add DINRegistry to Kiosk Market Token.
  await KioskMarketToken.at(KioskMarketToken.address).setDINRegistry(
    DINRegistry.address
  );

  // Add OrderTracker to Kiosk Market Token.
  await KioskMarketToken.at(KioskMarketToken.address).setOrderTracker(
    OrderTracker.address
  );
};

const deployENS = async (deployer, network, accounts) => {
  const account1 = accounts[0];

  await deployer.deploy(ENS);

  // Deploy the FIFSRegistrar and bind it with ENS
  await deployer.deploy(FIFSRegistrar, ENS.address, rootNode.namehash);

  // Transfer the owner of the `rootNode` to the FIFSRegistrar
  await ENS.at(ENS.address).setSubnodeOwner(
    "0x0",
    rootNode.sha3,
    FIFSRegistrar.address
  );
  // Register "example.eth" to a test account
  await FIFSRegistrar.at(FIFSRegistrar.address).register(subnodeSHA3, account1);

  // Deploy ENS Market, where ENS domains can be bought and sold
  await deployer.deploy(
    ENSMarket,
    DINRegistry.address,
    OrderTracker.address,
    KioskMarketToken.address,
    ENS.address
  );

  await deployer.deploy(
    ENSPublicProduct,
    DINRegistry.address,
    ENSMarket.address,
    ENS.address
  );
};

const addDINProduct = async (deployer, network, accounts) => {
  // Deploy the DINMarket
  await deployer.deploy(
    DINMarket,
    DINRegistry.address,
    OrderTracker.address,
    KioskMarketToken.address
  );

  // Set the market for the genesis DIN to the DINMarket
  await DINRegistry.at(DINRegistry.address).setMarket(
    genesis,
    DINMarket.address
  );

  // Register two new DINs (one for a demo ENS domain and one for a demo token ask offer).
  await KioskMarketToken.at(KioskMarketToken.address).buy(genesis, 1, 0);
};

const addENSProduct = async (deployer, network, accounts) => {
  // Set the market for the ENS DIN to the ENSMarket
  await DINRegistry.at(DINRegistry.address).setMarket(
    ENSDIN,
    ENSMarket.address
  );

  // Add resolvers for ENS DIN to ENSMarket
  await ENSMarket.at(ENSMarket.address).setProduct(
    ENSDIN,
    ENSPublicProduct.address,
    ENSPublicProduct.address,
    ENSPublicProduct.address
  );

  // Set market specific information for ENS
  await ENSMarket.at(ENSMarket.address).setName(ENSDIN, subnodeName);

  // Set market specific information for ENS
  await ENSMarket.at(ENSMarket.address).setENSNode(ENSDIN, subnodeNameHash);

  // List "example.eth" on ENSMarket
  await ENSPublicProduct.at(ENSPublicProduct.address).addENSDomain(
    ENSDIN,
    subnodeName,
    subnodeNameHash,
    price
  );

  // Transfer ownership of "example.eth" to the ENSPublicProduct
  await ENS.at(ENS.address).setOwner(subnodeNameHash, ENSPublicProduct.address);
};

module.exports = async (deployer, network, accounts) => {
  deployer.deploy(KioskMarketToken, initialSupply).then(async () => {
    await deployKiosk(deployer, network, accounts);
    await deployENS(deployer, network, accounts);
    await addDINProduct(deployer, network, accounts);
    await addENSProduct(deployer, network, accounts);
  });
};