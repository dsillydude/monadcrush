// Simple NFT contract interface for MonadCrush match cards
export const MONADCRUSH_NFT_CONTRACT = {
  address: '0x1234567890123456789012345678901234567890', // Placeholder address
  abi: [
    {
      "inputs": [
        {"name": "to", "type": "address"},
        {"name": "tokenURI", "type": "string"}
      ],
      "name": "mint",
      "outputs": [{"name": "tokenId", "type": "uint256"}],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "mintPrice",
      "outputs": [{"name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ]
} as const

// Generate metadata for match NFT
export function generateMatchNFTMetadata(match: {
  username: string
  compatibility: number
  reason: string
  avatar: string
  interests: string[]
}) {
  return {
    name: `MonCrush Match: ${match.username}`,
    description: `A MonadCrush match card with ${match.compatibility}% compatibility. ${match.reason}`,
    image: `https://monadcrush.app/api/nft-image/${match.username}`, // Placeholder URL
    attributes: [
      {
        trait_type: "Compatibility",
        value: match.compatibility
      },
      {
        trait_type: "Match Username",
        value: match.username
      },
      {
        trait_type: "Avatar",
        value: match.avatar
      },
      ...match.interests.map(interest => ({
        trait_type: "Interest",
        value: interest
      }))
    ]
  }
}

// Upload metadata to IPFS (mock implementation)
export async function uploadToIPFS(metadata: any): Promise<string> {
  // In a real implementation, this would upload to IPFS
  // For now, we'll return a mock IPFS hash
  const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}`
  console.log('Mock IPFS upload:', metadata)
  return `ipfs://${mockHash}`
}

