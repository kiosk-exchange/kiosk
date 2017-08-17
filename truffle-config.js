module.exports = {
  migrations_directory: "./migrations",
  networks: {
  	kovan: {
      network_id: "42",
      host: "localhost",
      port: 8546   // Different than the default below
    }
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }
};
