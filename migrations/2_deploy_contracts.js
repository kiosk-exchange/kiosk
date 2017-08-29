const web3 = new (require("web3"))();
const KioskMarketToken = artifacts.require("KioskMarketToken.sol");
const Buyer = artifacts.require("Buyer.sol");
const DINRegistry = artifacts.require("DINRegistry.sol");
const DINRegistrar = artifacts.require("DINRegistrar.sol");
const OrderMaker = artifacts.require("OrderMaker.sol");
const OrderStore = artifacts.require("OrderStore.sol");
const DINMarket = artifacts.require("DIN/DINMarket.sol");
const DINProduct = artifacts.require("DIN/DINProduct.sol");
const EtherMarket = artifacts.require("ether/EtherMarket.sol");
const ENSMarket = artifacts.require("ENS/ENSMarket.sol");
const ENSProduct = artifacts.require("ENS/ENSProduct.sol");
const ENS = artifacts.require("ENS/ENS/ENS.sol");
const FIFSRegistrar = artifacts.require("ENS/ENS/FIFSRegistrar.sol");
const namehash = require("../node_modules/eth-ens-namehash");
const tld = "eth";
const rootNode = getRootNodeFromTLD(tld);
const subnodeSHA3 = web3.sha3("example");
const subnodeName = "example.eth";
const subnodeNameHash = namehash(subnodeName);
const subnodePrice = web3.toWei(2, "ether");
const initialSupply = 1000000 * 10 ** 18; // Initialize KMT with 1 million tokens
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
  await KioskMarketToken.at(KioskMarketToken.address).setRegistry(DINRegistry.address);

  await deployer.deploy(DINMarket, KioskMarketToken.address);
  await DINRegistry.at(DINRegistry.address).setMarket(genesis, DINMarket.address);

  await deployer.deploy(DINRegistrar, KioskMarketToken.address);
  await KioskMarketToken.at(KioskMarketToken.address).setRegistrar(DINRegistrar.address);

  await deployer.deploy(OrderStore, KioskMarketToken.address);
  await KioskMarketToken.at(KioskMarketToken.address).setOrderStore(OrderStore.address);

  await deployer.deploy(OrderMaker, KioskMarketToken.address);
  await KioskMarketToken.at(KioskMarketToken.address).setOrderMaker(OrderMaker.address);

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
  )
  
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
  await deployer.deploy(ENSMarket, KioskMarketToken.address, ENS.address);

  await deployer.deploy(
    ENSProduct,
    KioskMarketToken.address,
    ENSMarket.address,
    ENS.address
  );


  await ENSProduct.at(ENSProduct.address).addENSDomain(subnodeName, subnodeNameHash, subnodePrice);

  const product = await ENSMarket.at(ENSMarket.address).product(1000000002);
  console.log(product);

  const price = await ENSMarket.at(ENSMarket.address).totalPrice(1000000002, 1, accounts[0]);
  console.log(price.toNumber());

  // Transfer ownership of "example.eth" to the ENSPublicProduct
  await ENS.at(ENS.address).setOwner(subnodeNameHash, ENSProduct.address);
};

module.exports = async (deployer, network, accounts) => {
  deployer.deploy(KioskMarketToken, initialSupply).then(async () => {
    await deployKiosk(deployer, network, accounts);
    await deployEtherMarket(deployer, network, accounts);
    await deployENS(deployer, network, accounts);
  });
};