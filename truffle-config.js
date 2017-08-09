// https://ethereum.stackexchange.com/questions/21210/syntaxerror-unexpected-token-import-on-truffle-test/21409
require('babel-register');
require('babel-polyfill');

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }
};
