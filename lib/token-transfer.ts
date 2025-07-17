// MON Token transfer system with real smart contract integration
import { createPublicClient, createWalletClient, http, parseEther, keccak256, toBytes } from 'viem'

// Deployed MonadCrushEscrow contract address
const ESCROW_CONTRACT_ADDRESS = '0x9EBbaB2aCc5641d2a0B2492865B6C300B134cd37'
const WMON_TOKEN_ADDRESS = '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701'

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

// Contract ABI for the MonadCrushEscrow
const ESCROW_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_monTokenAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "claimCodeHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "ClaimCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "claimCodeHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "Claimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_claimCodeHash",
        "type": "bytes32"
      }
    ],
    "name": "claimTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "claims",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "claimed",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "message",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_claimCodeHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_recipient",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_message",
        "type": "string"
      }
    ],
    "name": "createClaim",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_claimCodeHash",
        "type": "bytes32"
      }
    ],
    "name": "getClaimInfo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "claimed",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "message",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "monToken",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      }
    ],
    "name": "withdrawStuckTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
] as const

// WMON Token ABI (ERC20)
const WMON_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "account", "type": "address"}
    ],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

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

  constructor(walletClient: any) {
    this.publicClient = createPublicClient({
      chain: monadTestnet,
      transport: http('https://testnet-rpc.monad.xyz')
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

      // First approve the escrow contract to spend WMON tokens
      const approveTx = await this.walletClient.writeContract({
        address: WMON_TOKEN_ADDRESS,
        abi: WMON_ABI,
        functionName: 'approve',
        args: [ESCROW_CONTRACT_ADDRESS, amountWei],
        account: senderAddress as `0x${string}`
      })

      // Wait for approval transaction
      await this.publicClient.waitForTransactionReceipt({ hash: approveTx })

      // Create the claim
      const createClaimTx = await this.walletClient.writeContract({
        address: ESCROW_CONTRACT_ADDRESS,
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
      
      const result = await this.publicClient.readContract({
        address: ESCROW_CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'getClaimInfo',
        args: [claimCodeHash]
      })

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

      const claimTx = await this.walletClient.writeContract({
        address: ESCROW_CONTRACT_ADDRESS,
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

  // Check WMON balance
  async getWMONBalance(address: string): Promise<string> {
    try {
      const balance = await this.publicClient.readContract({
        address: WMON_TOKEN_ADDRESS,
        abi: WMON_ABI,
        functionName: 'balanceOf',
        args: [address as `0x${string}`]
      })

      return (Number(balance) / 1e18).toString() // Convert from wei to MON
    } catch (error) {
      console.error('Error getting WMON balance:', error)
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

// Contract addresses for easy access
export const CONTRACT_ADDRESSES = {
  ESCROW: ESCROW_CONTRACT_ADDRESS,
  WMON: WMON_TOKEN_ADDRESS
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


// Export the contract configuration for use in components
export const ESCROW_CONTRACT = {
  address: ESCROW_CONTRACT_ADDRESS as `0x${string}`,
  abi: ESCROW_ABI
}



// Add this to your token-transfer.ts for testing
export async function testContractConnection(publicClient: any) {
  try {
    const owner = await publicClient.readContract({
      address: ESCROW_CONTRACT.address,
      abi: ESCROW_CONTRACT.abi,
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


