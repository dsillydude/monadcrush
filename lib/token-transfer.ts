import { createPublicClient, createWalletClient, http, parseEther, keccak256, toBytes } from 'viem'
import { CONTRACT_ADDRESSES, ESCROW_ABI, ERC20_ABI } from './contracts'

// Monad Testnet chain configuration
const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'MonadExplorer', url: 'https://testnet.monadexplorer.com' },
  },
}

export interface ClaimInfo {
  amount: string
  recipient: string
  claimed: boolean
  message: string
  sender: string
}

export class TokenTransferService {
  private publicClient
  private walletClient

  constructor(walletClient: any ) {
    this.publicClient = createPublicClient({
      chain: monadTestnet,
      transport: http('https://testnet-rpc.monad.xyz' )
    })
    this.walletClient = walletClient
  }

  // Generate a secure 8-character claim code
  generateClaimCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Create a hash from the claim code
  hashClaimCode(claimCode: string): `0x${string}` {
    return keccak256(toBytes(claimCode))
  }

  // Create a claim with real smart contract interaction
  async createClaim(
    amount: string,
    recipientAddress: string,
    message: string,
    senderAddress: string
  ): Promise<{ claimCode: string; txHash: string }> {
    try {
      const claimCode = this.generateClaimCode()
      const claimCodeHash = this.hashClaimCode(claimCode)
      const amountWei = parseEther(amount)

      // Use the production contract address for the deployed escrow
      const escrowAddress = CONTRACT_ADDRESSES.PRODUCTION.MONAD_CRUSH_ESCROW as `0x${string}`
      const tokenAddress = CONTRACT_ADDRESSES.PRODUCTION.MON_TOKEN as `0x${string}` // Use PRODUCTION MON_TOKEN

      // First approve the escrow contract to spend MON tokens
      const approveTx = await this.walletClient.writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [escrowAddress, amountWei],
        account: senderAddress as `0x${string}`
      })

      // Wait for approval transaction
      await this.publicClient.waitForTransactionReceipt({ hash: approveTx })

      // Create the claim
      const createClaimTx = await this.walletClient.writeContract({
        address: escrowAddress,
        abi: ESCROW_ABI,
        functionName: 'createClaim',
        args: [claimCodeHash, amountWei, recipientAddress as `0x${string}`, message],
        account: senderAddress as `0x${string}`
      })

      return {
        claimCode,
        txHash: createClaimTx
      }
    } catch (error) {
      console.error('Error creating claim:', error)
      throw new Error('Failed to create claim')
    }
  }

  // Get claim information
  async getClaimInfo(claimCode: string): Promise<ClaimInfo | null> {
    try {
      const claimCodeHash = this.hashClaimCode(claimCode)
      const escrowAddress = CONTRACT_ADDRESSES.PRODUCTION.MONAD_CRUSH_ESCROW as `0x${string}`
      
      const result = await this.publicClient.readContract({
        address: escrowAddress,
        abi: ESCROW_ABI,
        functionName: 'getClaimInfo',
        args: [claimCodeHash]
      }) as [bigint, string, boolean, string, string]

      const [amount, recipient, claimed, message, sender] = result

      // Check if claim exists (amount > 0)
      if (amount === BigInt(0)) {
        return null
      }

      return {
        amount: (Number(amount) / 1e18).toString(), // Convert from wei to MON
        recipient,
        claimed,
        message,
        sender
      }
    } catch (error) {
      console.error('Error getting claim info:', error)
      return null
    }
  }

  // Claim tokens
  async claimTokens(claimCode: string, claimerAddress: string): Promise<string> {
    try {
      const claimCodeHash = this.hashClaimCode(claimCode)
      const escrowAddress = CONTRACT_ADDRESSES.PRODUCTION.MONAD_CRUSH_ESCROW as `0x${string}`

      const claimTx = await this.walletClient.writeContract({
        address: escrowAddress,
        abi: ESCROW_ABI,
        functionName: 'claimTokens',
        args: [claimCodeHash],
        account: claimerAddress as `0x${string}`
      })

      return claimTx
    } catch (error) {
      console.error('Error claiming tokens:', error)
      throw new Error('Failed to claim tokens')
    }
  }

  // Check MON balance
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
}

// Generate a unique claim code
export function generateClaimCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Default MON amounts for sending
export const MON_SEND_AMOUNTS = [
  { label: '1 MON', value: '1' },
  { label: '5 MON', value: '5' },
  { label: '10 MON', value: '10' },
  { label: 'Custom', value: 'custom' }
]

// Validate claim code format
export function isValidClaimCode(code: string): boolean {
  return /^[A-Z0-9]{8}$/.test(code)
}

// Format MON amount for display
export function formatMONAmount(amount: string): string {
  const num = parseFloat(amount)
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M MON`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K MON`
  } else {
    return `${num} MON`
  }
}

// Mock fallback functions for development
export async function storeClaim(claimData: {
  claimCode: string
  amount: string
  senderAddress: string
  recipientUsername: string
  matchData: any
}): Promise<boolean> {
  console.log('Storing claim:', claimData)
  await new Promise(resolve => setTimeout(resolve, 1000))
  return true
}

export async function getClaim(claimCode: string): Promise<{
  amount: string
  senderAddress: string
  recipientUsername: string
  matchData: any
  claimed: boolean
} | null> {
  console.log('Fetching claim:', claimCode)
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    amount: '5',
    senderAddress: '0x1234...5678',
    recipientUsername: 'crypto_queen',
    matchData: {
      compatibility: 85,
      reason: 'You both love Monad!'
    },
    claimed: false
  }
}

// Test contract connection
export async function testContractConnection(publicClient: any) {
  try {
    const escrowAddress = CONTRACT_ADDRESSES.PRODUCTION.MONAD_CRUSH_ESCROW as `0x${string}`
    
    const owner = await publicClient.readContract({
      address: escrowAddress,
      abi: ESCROW_ABI,
      functionName: 'owner'
    })
    
    console.log("Contract owner:", owner)
    console.log("Contract connection successful!")
    return true
  } catch (error) {
    console.error("Contract connection failed:", error)
    return false
  }
}
