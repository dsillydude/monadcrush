import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "ts-node/register";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    monadTestnet: {
      url: process.env.MONAD_TESTNET_URL || "https://rpc.monad.xyz/",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      monadTestnet: process.env.MONAD_EXPLORER_API_KEY || "",
    },
    customChains: [
      {
        network: "monadTestnet",
        chainId: 80001, // This should be the actual Monad Testnet Chain ID
        urls: {
          api: "https://explorer.monad.xyz/api",
          browser: "https://explorer.monad.xyz",
        },
      },
    ],
  },
};

export default config;


