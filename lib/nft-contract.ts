import { parseEther } from 'viem'
import { CONTRACT_ADDRESSES, NFT_ABI, ERC20_ABI } from './contracts'

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
          trait_type: "Rarity",
          value: this.getRarity(match.compatibility )
        },
        {
          trait_type: "Timestamp",
          value: new Date().toISOString()
        }
      ]
    }
  }

  // Determine rarity based on compatibility score
  private getRarity(compatibility: number): string {
    if (compatibility >= 95) return "Legendary"
    if (compatibility >= 85) return "Epic"
    if (compatibility >= 75) return "Rare"
    if (compatibility >= 60) return "Uncommon"
    return "Common"
  }

  // Convert metadata to data URI (for now, could be IPFS later)
  private metadataToDataURI(metadata: NFTMetadata): string {
    const jsonString = JSON.stringify(metadata)
    const base64 = Buffer.from(jsonString).toString('base64')
    return `data:application/json;base64,${base64}`
  }

  // Mint a match card NFT
  async mintMatchCard(
    match: Match,
    minterAddress: string
  ): Promise<{ tokenId: string; txHash: string }> {
    try {
      const nftAddress = CONTRACT_ADDRESSES.PRODUCTION.MONAD_CRUSH_NFT as `0x${string}`
      const tokenAddress = CONTRACT_ADDRESSES.PRODUCTION.MON_TOKEN as `0x${string}` // Use PRODUCTION MON_TOKEN
      
      // Generate metadata
      const metadata = this.generateMatchNFTMetadata(match)
      const tokenURI = this.metadataToDataURI(metadata)

      // Get mint price from contract
      const mintPrice = await this.publicClient.readContract({
        address: nftAddress,
        abi: NFT_ABI,
        functionName: 'mintPrice'
      }) as bigint

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
        args: [match.username, BigInt(match.compatibility), match.reason, tokenURI],
        account: minterAddress as `0x${string}`
      })

      // Wait for mint transaction and get receipt
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash: mintTx })
      
      // Extract token ID from logs (simplified - in production you'd parse the event properly)
      const tokenId = "1" // This would be extracted from the MatchCardMinted event

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
  async getMatchCard(tokenId: string): Promise<any> {
    try {
      const nftAddress = CONTRACT_ADDRESSES.PRODUCTION.MONAD_CRUSH_NFT as `0x${string}`
      
      const matchCard = await this.publicClient.readContract({
        address: nftAddress,
        abi: NFT_ABI,
        functionName: 'getMatchCard',
        args: [BigInt(tokenId)]
      })

      return matchCard
    } catch (error) {
      console.error('Error getting match card:', error)
      return null
    }
  }

  // Check MON balance for minting
  async getMONBalance(address: string): Promise<string> {
    try {
      const tokenAddress = CONTRACT_ADDRESSES.PRODUCTION.MON_TOKEN as `0x${string}` // Use PRODUCTION MON_TOKEN
      
      const balance = await this.publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address as `0x${string}`]
      }) as bigint

      return (Number(balance) / 1e18).toString() // Convert from wei to MON
    } catch (error) {
      console.error('Error getting MON balance:', error)
      return '0'
    }
  }

  // Get mint price
  async getMintPrice(): Promise<string> {
    try {
      const nftAddress = CONTRACT_ADDRESSES.PRODUCTION.MONAD_CRUSH_NFT as `0x${string}`
      
      const mintPrice = await this.publicClient.readContract({
        address: nftAddress,
        abi: NFT_ABI,
        functionName: 'mintPrice'
      }) as bigint

      return (Number(mintPrice) / 1e18).toString() // Convert from wei to MON
    } catch (error) {
      console.error('Error getting mint price:', error)
      return '0.01' // Default fallback
    }
  }
}
