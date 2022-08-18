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

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/VwqKnMFZe3o3PFziGWDt23OjFHfDKYDV" || process.env.ALCHEMY_MAINNET_RPC_URL || ""    
// Fork mainnet, btw- ALCHEMY_MAINNET_RPC_URL not defined here
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "a02bc5bc-fca2-4044-8bb5-52495b5c878e"
const KOVAN_RPC_URL =
    process.env.KOVAN_RPC_URL || "https://eth-mainnet.alchemyapi.io/v2/your-api-key"                // using Rinkeby
const PRIVATE_KEY =
    process.env.PRIVATE_KEY || "e79d39e6ee8ff2e35064fbf8042e2ec7c2d45d1074d75f95625be80f00073417"
    const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ||  "IJIWR1PQW9I2DYY7G82PWRXITN3TEV3QAC"
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL ||  "https://eth-rinkeby.alchemyapi.io/v2/s-nj9OTPBrtTKzx7n2It6M2h_EUj55HR"

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
                version: "0.6.12",
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