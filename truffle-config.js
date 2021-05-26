require("babel-register");
require("babel-polyfill");
require("dotenv").config();

module.exports = {
  networks: {
    deployment: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network
    }
  },

  contracts_directory: './src/contracts',
  contracts_build_directory: './src/abis',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    },
  },
};