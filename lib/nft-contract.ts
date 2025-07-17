// MonadCrush NFT contract interface for match cards
export const MONADCRUSH_NFT_CONTRACT = {
  address: '0x0000000000000000000000000000000000000000', // Will be updated after deployment
  abi: [
    {
      "inputs": [
        {"internalType": "address", "name": "to", "type": "address"},
        {"internalType": "string", "name": "tokenURI", "type": "string"}
      ],
      "name": "mint",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "mintPrice",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
      "name": "tokenURI",
      "outputs": [{"internalType": "string", "name": "", "type": "string"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
      "name": "balanceOf",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "address", "name": "to", "type": "address"},
        {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
        {"indexed": false, "internalType": "string", "name": "tokenURI", "type": "string"}
      ],
      "name": "NFTMinted",
      "type": "event"
    }
  ]
} as const

interface Match {
  username: string
  compatibility: number
  reason: string
  avatar: string
  interests: string[]
}

// Generate metadata for match NFT
export function generateMatchNFTMetadata(match: Match) {
  const timestamp = new Date().toISOString()
  
  return {
    name: `MonCrush Match: ${match.username}`,
    description: `A MonadCrush match card commemorating your ${match.compatibility}% compatibility with @${match.username}. ${match.reason}`,
    image: generateNFTImageURL(match),
    external_url: "https://monadcrush.app",
    attributes: [
      {
        trait_type: "Compatibility",
        value: match.compatibility,
        display_type: "number"
      },
      {
        trait_type: "Match Username",
        value: match.username
      },
      {
        trait_type: "Avatar",
        value: match.avatar
      },
      {
        trait_type: "Compatibility Tier",
        value: getCompatibilityTier(match.compatibility)
      },
      {
        trait_type: "Match Date",
        value: timestamp.split('T')[0] // YYYY-MM-DD format
      },
      ...match.interests.map(interest => ({
        trait_type: "Interest",
        value: interest
      }))
    ],
    properties: {
      compatibility: match.compatibility,
      reason: match.reason,
      matchedAt: timestamp
    }
  }
}

// Generate a unique image URL for the NFT based on match data
function generateNFTImageURL(match: Match): string {
  // Create a deterministic image URL based on match data
  const params = new URLSearchParams({
    username: match.username,
    compatibility: match.compatibility.toString(),
    avatar: match.avatar,
    interests: match.interests.join(',')
  })
  
  // In production, this would point to your NFT image generation service
  return `https://monadcrush.app/api/nft-image?${params.toString()}`
}

// Get compatibility tier for rarity
function getCompatibilityTier(compatibility: number): string {
  if (compatibility >= 95) return "Perfect Match"
  if (compatibility >= 90) return "Soulmate"
  if (compatibility >= 85) return "Excellent"
  if (compatibility >= 80) return "Great"
  if (compatibility >= 75) return "Good"
  if (compatibility >= 70) return "Compatible"
  return "Potential"
}

// Upload metadata to IPFS using Pinata or similar service
export async function uploadToIPFS(metadata: any): Promise<string> {
  try {
    // In a real implementation, you would use a service like Pinata, Infura, or Web3.Storage
    // For now, we'll simulate the upload and return a mock IPFS hash
    
    console.log('Uploading metadata to IPFS:', metadata)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate a mock IPFS hash based on the metadata content
    const metadataString = JSON.stringify(metadata)
    const mockHash = generateMockIPFSHash(metadataString)
    
    console.log('Mock IPFS upload successful:', `ipfs://${mockHash}`)
    
    return `ipfs://${mockHash}`
  } catch (error) {
    console.error('IPFS upload failed:', error)
    throw new Error('Failed to upload metadata to IPFS')
  }
}

// Generate a deterministic mock IPFS hash
function generateMockIPFSHash(content: string): string {
  // Simple hash function for demo purposes
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Convert to base36 and pad to create a realistic-looking IPFS hash
  const hashString = Math.abs(hash).toString(36)
  return `Qm${hashString.padStart(44, '0').substring(0, 44)}`
}

// Real IPFS upload function (commented out for demo)
/*
export async function uploadToIPFS(metadata: any): Promise<string> {
  const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY
  const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY
  
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    throw new Error('Pinata API keys not configured')
  }
  
  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'pinata_api_key': PINATA_API_KEY,
      'pinata_secret_api_key': PINATA_SECRET_KEY,
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: {
        name: `MonCrush-${metadata.name}`,
      },
    }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to upload to IPFS')
  }
  
  const result = await response.json()
  return `ipfs://${result.IpfsHash}`
}
*/

// Validate NFT contract address
export function isValidNFTContract(address: string): boolean {
  return address !== '0x0000000000000000000000000000000000000000' && 
         address.startsWith('0x') && 
         address.length === 42
}

// Update contract address after deployment
export function updateNFTContractAddress(address: string) {
  if (isValidNFTContract(address)) {
    // In a real app, this would update the contract address in your configuration
    console.log('NFT Contract address updated to:', address)
    return true
  }
  return false
}

