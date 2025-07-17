import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "ts-node/register";

const config: HardhatUserConfig = {
  solidity: "0.8.24", // Updated to match MonadCrushEscrow.sol
  networks: {
    monadTestnet: {
      url: process.env.MONAD_TESTNET_URL || "https://testnet-rpc.monad.xyz", // Updated to official testnet RPC
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  // etherscan configuration commented out until Monad Testnet Chain ID and Explorer API are confirmed
  // etherscan: {
  //   apiKey: {
  //     monadTestnet: process.env.MONAD_EXPLORER_API_KEY || "",
  //   },
  //   customChains: [
  //     {
  //       network: "monadTestnet",
  //       chainId: 80001, // This needs to be the actual Monad Testnet Chain ID
  //       urls: {
  //         apiURL: "https://explorer.monad.xyz/api", // Replace with actual Monad Explorer API URL
  //         browserURL: "https://explorer.monad.xyz", // Replace with actual Monad Explorer URL
  //       },
  //     },
  //   ],
  // },
};

export default config;