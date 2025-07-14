// MON Token transfer system with claim codes
import { parseEther } from 'viem'

// MON Token contract on Monad Testnet
export const MON_TOKEN_CONTRACT = {
  address: '0x1234567890123456789012345678901234567890', // Placeholder MON token address
  abi: [
    {
      "inputs": [
        {"name": "to", "type": "address"},
        {"name": "amount", "type": "uint256"}
      ],
      "name": "transfer",
      "outputs": [{"name": "", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "owner", "type": "address"}
      ],
      "name": "balanceOf",
      "outputs": [{"name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ]
} as const

// Escrow contract for claim codes
export const ESCROW_CONTRACT = {
  address: '0x2345678901234567890123456789012345678901', // Placeholder escrow address
  abi: [
    {
      "inputs": [
        {"name": "claimCode", "type": "string"},
        {"name": "amount", "type": "uint256"},
        {"name": "recipient", "type": "string"}
      ],
      "name": "createClaim",
      "outputs": [{"name": "", "type": "bool"}],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "claimCode", "type": "string"}
      ],
      "name": "claimTokens",
      "outputs": [{"name": "", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "claimCode", "type": "string"}
      ],
      "name": "getClaimInfo",
      "outputs": [
        {"name": "amount", "type": "uint256"},
        {"name": "recipient", "type": "string"},
        {"name": "claimed", "type": "bool"}
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
} as const

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

// Mock API functions (in production, these would be real backend calls)
export async function storeClaim(claimData: {
  claimCode: string
  amount: string
  senderAddress: string
  recipientUsername: string
  matchData: any
}): Promise<boolean> {
  // In production, this would store the claim in a database
  console.log('Storing claim:', claimData)
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock success
  return true
}

export async function getClaim(claimCode: string): Promise<{
  amount: string
  senderAddress: string
  recipientUsername: string
  matchData: any
  claimed: boolean
} | null> {
  // In production, this would fetch from a database
  console.log('Fetching claim:', claimCode)
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Mock response (in real implementation, this would return actual data)
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

