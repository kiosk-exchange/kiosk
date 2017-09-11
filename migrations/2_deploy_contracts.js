const web3 = new (require("web3"))();
const Kiosk = artifacts.require("Kiosk.sol");
const KioskMarketToken = artifacts.require("KioskMarketToken.sol");
const Buy = artifacts.require("Buy.sol");
const DINRegistry = artifacts.require("DINRegistry.sol");
const DINRegistrar = artifacts.require("DINRegistrar.sol");
const OrderMaker = artifacts.require("OrderMaker.sol");
const OrderStore = artifacts.require("OrderStore.sol");
const DINMarket = artifacts.require("DIN/DINMarket.sol");
const EtherMarket = artifacts.require("ether/EtherMarket.sol");
const ENSMarket = artifacts.require("ENS/ENSMarket.sol");
const ENS = artifacts.require("ENS/ENS/ENS.sol");
const TestRegistrar = artifacts.require("ENS/ENS/TestRegistrar.sol");
const strings = artifacts.require("utils/strings.sol");
const StringUtils = artifacts.require("utils/StringUtils.sol");
const namehash = require("../node_modules/eth-ens-namehash");
const tld = "eth";
const rootNode = getRootNodeFromTLD(tld);
const subnodeSHA3 = web3.sha3("example");
const subnodeName = "example.eth";
const subnodeNameHash = namehash(subnodeName);
const subnodePrice = web3.toWei(0.02, "ether"); // Price in KMT, just using web3 for decimal conversion
const initialSupply = web3.toWei(1000000, "ether"); // Initialize KMT with 1 million tokens
const genesis = 1000000000; // The genesis DIN (used for DIN product)
const Promise = require("bluebird");

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
  // Deploy Kiosk Market Token.
  await deployer.deploy(KioskMarketToken, Kiosk.address, initialSupply);
  await Kiosk.at(Kiosk.address).setKMT(KioskMarketToken.address);

  // Deploy the Kiosk protocol contracts.
  await deployer.deploy(Buy, Kiosk.address);
  await Kiosk.at(Kiosk.address).setBuy(Buy.address, true);

  await deployer.deploy(DINRegistry, Kiosk.address, genesis);
  await Kiosk.at(Kiosk.address).setRegistry(DINRegistry.address);

  await deployer.deploy(DINMarket, Kiosk.address);
  await DINRegistry.at(DINRegistry.address).setMarket(
    genesis,
    DINMarket.address
  );

  await deployer.deploy(DINRegistrar, Kiosk.address);
  await Kiosk.at(Kiosk.address).setRegistrar(DINRegistrar.address);

  await deployer.deploy(OrderStore, Kiosk.address);
  await Kiosk.at(Kiosk.address).setOrderStore(OrderStore.address);

  await deployer.deploy(OrderMaker, Kiosk.address);
  await Kiosk.at(Kiosk.address).setOrderMaker(OrderMaker.address);

  // Bind the Kiosk protocol contracts to each other.
  await Buy.at(Buy.address).updateKiosk();
  await DINRegistry.at(DINRegistry.address).updateKiosk();
  await DINRegistrar.at(DINRegistrar.address).updateKiosk();
  await OrderStore.at(OrderStore.address).updateKiosk();
  await OrderMaker.at(OrderMaker.address).updateKiosk();
  await DINMarket.at(DINMarket.address).updateKiosk();
};

const deployEtherMarket = async (deployer, network, accounts) => {
  // Deploy Ether Market contract (KMT crowdsale / ETH product)
  await deployer.deploy(EtherMarket, Kiosk.address);

  // Transfer the entire KMT balance to EtherMarket.
  await KioskMarketToken.at(KioskMarketToken.address).transfer(
    EtherMarket.address,
    initialSupply
  );
};

const deployENS = async (deployer, network, accounts) => {
  const account1 = accounts[0];

  await deployer.deploy(ENS);

  // Deploy the TestRegistrar and bind it with ENS
  await deployer.deploy(TestRegistrar, ENS.address, rootNode.namehash);

  // Transfer the owner of the `rootNode` to the TestRegistrar
  await ENS.at(ENS.address).setSubnodeOwner(
    "0x0",
    rootNode.sha3,
    TestRegistrar.address
  );

  // Register a DIN.
  await Buy.at(Buy.address).buyDIN();

  const event = Buy.at(Buy.address).LogBuyDIN({});
  const eventAsync = Promise.promisifyAll(event)
  const logs = await eventAsync.getAsync();
  const DIN = logs[0]["args"]["DIN"];

  // Register "example.eth" to a test account
  await TestRegistrar.at(TestRegistrar.address).register(subnodeSHA3, account1);

  // Deploy ENS Market, where ENS domains can be bought and sold
  await deployer.deploy(strings);
  await deployer.deploy(StringUtils);
  await deployer.link(strings, ENSMarket);
  await deployer.link(StringUtils, ENSMarket);
  await deployer.deploy(ENSMarket, Kiosk.address, ENS.address);

  await ENSMarket.at(ENSMarket.address).setDomain(
    DIN,
    subnodeName,
    subnodeNameHash,
    subnodePrice,
    true
  );

  await DINRegistry.at(DINRegistry.address).setMarket(
    DIN,
    ENSMarket.address
  );

  // Transfer ownership of "example.eth" to the ENSMarket
  await ENS.at(ENS.address).setOwner(subnodeNameHash, ENSMarket.address);
};

module.exports = async (deployer, network, accounts) => {
  deployer.deploy(Kiosk).then(async () => {
    await deployKiosk(deployer, network, accounts);
    await deployEtherMarket(deployer, network, accounts);
    await deployENS(deployer, network, accounts);
  });
};