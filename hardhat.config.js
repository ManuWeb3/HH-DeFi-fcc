require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            forking: {
                url: MAINNET_RPC_URL,
            },
        },
        localhost: {
            chainId: 31337,
        },
        kovan: {
            url: KOVAN_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 42,
            blockConfirmations: 6,
        },
        rinkeby: {                    // 2nd kind of HH n/w = JSON-RPC based networks (external nodes incl. dummy Ganache)
          chainId: 4,
          blockConfirmations: 6,      // more needed as it's a testnet
          url: RINKEBY_RPC_URL,
          accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],    // it's always an array + // undefined is a keyword here
          //saveDeployments: true,      // details later ??
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.8",
            },
            {
                version: "0.6.12",             //  to use ILendingPoolAddressesProvider.sol interface
            },
            {
                version: "0.4.19",            //  to use IWeth.sol interface
            },
        ],
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
  }