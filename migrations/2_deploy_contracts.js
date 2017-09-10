const web3 = new (require("web3"))();
const KioskMarketToken = artifacts.require("KioskMarketToken.sol");
const Buyer = artifacts.require("Buyer.sol");
const DINRegistry = artifacts.require("DINRegistry.sol");
const DINRegistrar = artifacts.require("DINRegistrar.sol");
const OrderMaker = artifacts.require("OrderMaker.sol");
const OrderStore = artifacts.require("OrderStore.sol");
const DINMarket = artifacts.require("DIN/DINMarket.sol");
const EtherMarket = artifacts.require("ether/EtherMarket.sol");
const ENSMarket = artifacts.require("ENS/ENSMarket.sol");
const ENS = artifacts.require("ENS/ENS/ENS.sol");
const TestRegistrar = artifacts.require("ENS/ENS/TestRegistrar.sol");
const namehash = require("../node_modules/eth-ens-namehash");
const tld = "eth";
const rootNode = getRootNodeFromTLD(tld);
const subnodeSHA3 = web3.sha3("example");
const subnodeName = "example.eth";
const subnodeNameHash = namehash(subnodeName);
const subnodePrice = web3.toWei(0.02, "ether"); // Price in KMT, just using web3 for decimal conversion

const offChainSHA3 = web3.sha3("offthechain");
const offChainSubnodeName = "offthechain.eth";
const offChainNameHash = namehash(offChainSubnodeName);
const offChainPrice = web3.toWei(100, "ether");

const initialSupply = web3.toWei(1000000, "ether"); // Initialize KMT with 1 million tokens
const genesis = 1000000000; // The genesis DIN (used for DIN product)

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
  // Deploy the Kiosk protocol contracts.
  await deployer.deploy(Buyer, KioskMarketToken.address);
  await KioskMarketToken.at(KioskMarketToken.address).setBuyer(Buyer.address);

  // Intitialize DINRegistry with a genesis DIN of 10000000000 and bind it to KMT.
  await deployer.deploy(DINRegistry, KioskMarketToken.address, genesis);
  await KioskMarketToken.at(KioskMarketToken.address).setRegistry(
    DINRegistry.address
  );

  await deployer.deploy(DINMarket, KioskMarketToken.address);
  await DINRegistry.at(DINRegistry.address).setMarket(
    genesis,
    DINMarket.address
  );

  await deployer.deploy(DINRegistrar, KioskMarketToken.address);
  await KioskMarketToken.at(KioskMarketToken.address).setRegistrar(
    DINRegistrar.address
  );

  await deployer.deploy(OrderStore, KioskMarketToken.address);
  await KioskMarketToken.at(KioskMarketToken.address).setOrderStore(
    OrderStore.address
  );

  await deployer.deploy(OrderMaker, KioskMarketToken.address);
  await KioskMarketToken.at(KioskMarketToken.address).setOrderMaker(
    OrderMaker.address
  );

  // Bind the Kiosk protocol contracts to each other.
  await Buyer.at(Buyer.address).updateKiosk();
  await DINRegistry.at(DINRegistry.address).updateKiosk();
  await DINRegistrar.at(DINRegistrar.address).updateKiosk();
  await OrderStore.at(OrderStore.address).updateKiosk();
  await OrderMaker.at(OrderMaker.address).updateKiosk();
  await DINMarket.at(DINMarket.address).updateKiosk();
};

const deployEtherMarket = async (deployer, network, accounts) => {
  // Deploy Ether Market contract (KMT crowdsale / ETH product)
  await deployer.deploy(EtherMarket, KioskMarketToken.address);

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

  // Register 2 DINs.
  await KioskMarketToken.at(KioskMarketToken.address).buy(genesis, 2, 0);

  // Register "example.eth" to a test account
  await TestRegistrar.at(TestRegistrar.address).register(subnodeSHA3, account1);

  // Register "offthechain.eth" to a test account (demonstrate off-chain price changes).
  await TestRegistrar.at(TestRegistrar.address).register(
    offChainSHA3,
    account1
  );

  // Deploy ENS Market, where ENS domains can be bought and sold
  await deployer.deploy(ENSMarket, KioskMarketToken.address, ENS.address);

  await ENSMarket.at(ENSMarket.address).setDomain(
    1000000002,
    subnodeName,
    subnodeNameHash,
    subnodePrice,
    true
  );
  await ENSMarket.at(ENSMarket.address).setDomain(
    1000000003,
    offChainSubnodeName,
    offChainNameHash,
    offChainPrice,
    true
  );

  await DINRegistry.at(DINRegistry.address).setMarket(
    1000000002,
    ENSMarket.address
  );

  await DINRegistry.at(DINRegistry.address).setMarket(
    1000000003,
    ENSMarket.address
  );

  // Transfer ownership of "example.eth" to the ENSPublicProduct
  await ENS.at(ENS.address).setOwner(subnodeNameHash, ENSMarket.address);
  await ENS.at(ENS.address).setOwner(offChainNameHash, ENSMarket.address);
};

module.exports = async (deployer, network, accounts) => {
  deployer.deploy(KioskMarketToken, initialSupply).then(async () => {
    await deployKiosk(deployer, network, accounts);
    await deployEtherMarket(deployer, network, accounts);
    await deployENS(deployer, network, accounts);
  });
};