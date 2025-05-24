require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require('dotenv/config');
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.24',
  defaultNetwork: process.env.HARDHAT_CONFIG_DEFAULT_NETWORK,
  networks: {
    hardhat: {
      chainId: +process.env.HARDHAT_CONFIG_CHAIN_ID,
      name: process.env.HARDHAT_CONFIG_DEFAULT_NETWORK,
    },
    [process.env.HARDHAT_CONFIG_DEFAULT_NETWORK]: {
      url: process.env.HARDHAT_CONFIG_URL_KEY,
      accounts: [process.env.HARDHAT_CONFIG_WALLET],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "BIJTKBMC4EP6EU17C2FFA2X7XBC9UAKCWI"
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: true,
    apiUrl: "https://api-amoy.polygonscan.com/api"
  },
  paths: {
    root: './hardhat',
  },
};
