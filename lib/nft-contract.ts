import { CONTRACT_ADDRESSES, NFT_ABI, ERC20_ABI, NFT_MINT_PRICE } from './contracts'
import { parseEther } from 'viem'

interface Match {
  username: string
  compatibility: number
  reason: string
  avatar: string
  interests: string[]
}

export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
}

export class NFTService {
  private publicClient
  private walletClient

  constructor(walletClient: any, publicClient: any) {
    this.walletClient = walletClient
    this.publicClient = publicClient
  }

  // Generate metadata for a match NFT
  generateMatchNFTMetadata(match: Match): NFTMetadata {
    return {
      name: `MonCrush Match Card - ${match.username}`,
      description: `A MonCrush match card commemorating your ${match.compatibility}% compatibility with @${match.username}. ${match.reason}`,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${match.username}&backgroundColor=6B46C1,EC4899`, // Generate avatar
      attributes: [
        {
          trait_type: "Matched User",
          value: match.username
        },
        {
          trait_type: "Compatibility Score",
          value: match.compatibility
        },
        {
          trait_type: "Match Reason",
          value: match.reason
        },
        {
          trait_type: "Primary Interest",
          value: match.interests[0] || "Monad"
        },
        {
          trait_type: "Rarity",
          value: match.compatibility >= 90 ? "Legendary" : 
                 match.compatibility >= 80 ? "Epic" : 
                 match.compatibility >= 70 ? "Rare" : "Common"
        }
      ]
    }
  }

  // Upload metadata to IPFS (mock implementation)
  async uploadToIPFS(metadata: NFTMetadata): Promise<string> {
    // In a real implementation, this would upload to IPFS
    // For now, we'll create a data URI
    const jsonString = JSON.stringify(metadata, null, 2)
    const dataUri = `data:application/json;base64,${btoa(jsonString)}`
    return dataUri
  }

  // Mint an NFT
  async mintMatchCard(
    match: Match,
    minterAddress: string
  ): Promise<{ tokenId: number; txHash: string }> {
    try {
      const metadata = this.generateMatchNFTMetadata(match)
      const tokenURI = await this.uploadToIPFS(metadata)
      const mintPrice = parseEther(NFT_MINT_PRICE)
      
      const nftAddress = CONTRACT_ADDRESSES.MONAD_CRUSH_NFT as `0x${string}`
      const tokenAddress = CONTRACT_ADDRESSES.MOCK_MON_TOKEN as `0x${string}` // For testing

      // First approve the NFT contract to spend MON tokens
      const approveTx = await this.walletClient.writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [nftAddress, mintPrice],
        account: minterAddress as `0x${string}`
      })

      // Wait for approval transaction
      await this.publicClient.waitForTransactionReceipt({ hash: approveTx })

      // Mint the NFT
      const mintTx = await this.walletClient.writeContract({
        address: nftAddress,
        abi: NFT_ABI,
        functionName: 'mintMatchCard',
        args: [
          match.username,
          BigInt(match.compatibility),
          match.reason,
          tokenURI
        ],
        account: minterAddress as `0x${string}`
      })

      // Wait for mint transaction and get receipt
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash: mintTx })
      
      // Extract token ID from logs (simplified)
      const tokenId = 1 // In a real implementation, parse from event logs
      
      return {
        tokenId,
        txHash: mintTx
      }
    } catch (error) {
      console.error('Error minting NFT:', error)
      throw new Error('Failed to mint NFT')
    }
  }

  // Get match card details
  async getMatchCard(tokenId: number): Promise<{
    matchedUser: string
    compatibilityScore: number
    matchReason: string
    timestamp: number
    minter: string
  } | null> {
    try {
      const nftAddress = CONTRACT_ADDRESSES.MONAD_CRUSH_NFT as `0x${string}`
      
      const result = await this.publicClient.readContract({
        address: nftAddress,
        abi: NFT_ABI,
        functionName: 'getMatchCard',
        args: [BigInt(tokenId)]
      })

      return {
        matchedUser: result.matchedUser,
        compatibilityScore: Number(result.compatibilityScore),
        matchReason: result.matchReason,
        timestamp: Number(result.timestamp),
        minter: result.minter
      }
    } catch (error) {
      console.error('Error getting match card:', error)
      return null
    }
  }

  // Get current mint price
  async getMintPrice(): Promise<string> {
    try {
      const nftAddress = CONTRACT_ADDRESSES.MONAD_CRUSH_NFT as `0x${string}`
      
      const price = await this.publicClient.readContract({
        address: nftAddress,
        abi: NFT_ABI,
        functionName: 'mintPrice'
      })

      return (Number(price) / 1e18).toString() // Convert from wei to MON
    } catch (error) {
      console.error('Error getting mint price:', error)
      return NFT_MINT_PRICE
    }
  }
}

// Export utility functions
export function generateMatchNFTMetadata(match: Match): NFTMetadata {
  return {
    name: `MonCrush Match Card - ${match.username}`,
    description: `A MonCrush match card commemorating your ${match.compatibility}% compatibility with @${match.username}. ${match.reason}`,
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${match.username}&backgroundColor=6B46C1,EC4899`,
    attributes: [
      {
        trait_type: "Matched User",
        value: match.username
      },
      {
        trait_type: "Compatibility Score",
        value: match.compatibility
      },
      {
        trait_type: "Match Reason",
        value: match.reason
      },
      {
        trait_type: "Primary Interest",
        value: match.interests[0] || "Monad"
      },
      {
        trait_type: "Rarity",
        value: match.compatibility >= 90 ? "Legendary" : 
               match.compatibility >= 80 ? "Epic" : 
               match.compatibility >= 70 ? "Rare" : "Common"
      }
    ]
  }
}

export async function uploadToIPFS(metadata: NFTMetadata): Promise<string> {
  // Mock implementation - in production, use actual IPFS
  const jsonString = JSON.stringify(metadata, null, 2)
  const dataUri = `data:application/json;base64,${btoa(jsonString)}`
  return dataUri
}

// Contract configuration for easy access
export const MONADCRUSH_NFT_CONTRACT = {
  address: CONTRACT_ADDRESSES.MONAD_CRUSH_NFT as `0x${string}`,
  abi: NFT_ABI
}

