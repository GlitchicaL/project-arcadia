const HDWalletProvider = require("truffle-hdwallet-provider-privkey");

require("babel-register");
require("babel-polyfill");
require("dotenv").config();
const privateKeys = process.env.PRIVATE_KEYS || ""

module.exports = {
  networks: {
    deployment: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network
    },
    kovan: {
      provider: function () {
        return new HDWalletProvider(
          // Private Key
          privateKeys.split(','),

          // URL to Ethereum Node
          `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
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