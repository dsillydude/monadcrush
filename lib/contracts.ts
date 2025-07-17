export const CONTRACT_ADDRESSES = {
  // Local development addresses (update these for production)
  MOCK_MON_TOKEN: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  MONAD_CRUSH_ESCROW: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  MONAD_CRUSH_NFT: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  
  // Production addresses (replace with actual deployed addresses)
  PRODUCTION: {
    MON_TOKEN: "0x...", // Replace with actual MON token address on Monad Testnet
    MONAD_CRUSH_ESCROW: "0x9EBbaB2aCc5641d2a0B2492865B6C300B134cd37", // User's deployed contract
    MONAD_CRUSH_NFT: "0x...", // Replace with actual NFT contract address
  }
};

export const CHAIN_CONFIG = {
  MONAD_TESTNET: {
    chainId: 10143,
    name: "Monad Testnet",
    rpcUrl: "https://testnet-rpc.monad.xyz",
    blockExplorer: "https://monad-testnet.socialscan.io",
  },
  LOCAL: {
    chainId: 31337,
    name: "Hardhat Local",
    rpcUrl: "http://127.0.0.1:8545",
  }
};

export const NFT_MINT_PRICE = "0.01"; // MON tokens

// ABI fragments for contract interaction
export const ESCROW_ABI = [
  "function createClaim(bytes32 claimCodeHash, uint256 amount, address recipient, string memory message) external",
  "function claimTokens(bytes32 claimCodeHash) external",
  "function getClaimInfo(bytes32 claimCodeHash) external view returns (uint256 amount, address recipient, bool claimed, string memory message, address sender)",
  "event ClaimCreated(bytes32 indexed claimCodeHash, uint256 amount, address recipient, address sender)",
  "event Claimed(bytes32 indexed claimCodeHash, uint256 amount, address recipient)"
];

export const NFT_ABI = [
  "function mintMatchCard(string memory matchedUser, uint256 compatibilityScore, string memory matchReason, string memory tokenURI) external returns (uint256)",
  "function getMatchCard(uint256 tokenId) external view returns (tuple(string matchedUser, uint256 compatibilityScore, string matchReason, uint256 timestamp, address minter))",
  "function mintPrice() external view returns (uint256)",
  "event MatchCardMinted(uint256 indexed tokenId, address indexed minter, string matchedUser, uint256 compatibilityScore)"
];

export const ERC20_ABI = [
  "function balanceOf(address owner) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

