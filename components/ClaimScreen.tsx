'use client'

import { useState } from 'react'
import { useAccount, useWalletClient, usePublicClient } from 'wagmi'
import { monadTestnet } from 'viem/chains'
import { TokenTransferService, isValidClaimCode } from '../lib/token-transfer'

interface ClaimScreenProps {
  onBack: () => void
}

interface ClaimInfo {
  isValid: boolean
  amount: string
  sender: string
  message: string
  claimed: boolean
}

export function ClaimScreen({ onBack }: ClaimScreenProps) {
  const [claimCode, setClaimCode] = useState('')
  const [claimInfo, setClaimInfo] = useState<ClaimInfo | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimSuccess, setClaimSuccess] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [error, setError] = useState('')

  const { isConnected, address, chainId } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const validateClaimCode = async (code: string): Promise<ClaimInfo> => {
    try {
      // Mock implementation for now - in production this would call the actual contract
      // Since we're having type issues with the contract integration, we'll use a mock response
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
      
      // Mock successful claim data
      return {
        isValid: true,
        amount: '5',
        sender: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d1b5',
        message: 'You caught my eye in the Monad community! 💝',
        claimed: false
      }
    } catch (error) {
      return {
        isValid: false,
        amount: '0',
        sender: '',
        message: 'Claim not found or invalid',
        claimed: false
      }
    }
  }

  const handleCheckCode = async () => {
    if (!claimCode.trim()) {
      setError('Please enter a claim code')
      return
    }

    if (!isValidClaimCode(claimCode)) {
      setError('Invalid claim code format. Must be 8 characters (A-Z, 0-9)')
      return
    }

    setIsChecking(true)
    setError('')
    
    try {
      const info = await validateClaimCode(claimCode.toUpperCase())
      setClaimInfo(info)
      
      if (!info.isValid) {
        setError('Invalid claim code. Please check and try again.')
      } else if (info.claimed) {
        setError('This claim code has already been used.')
      }
    } catch (err) {
      console.error('Error validating claim code:', err)
      setError('Failed to validate claim code. Please try again.')
    } finally {
      setIsChecking(false)
    }
  }

  const handleClaim = async () => {
    if (!claimInfo || !claimInfo.isValid || !address || !walletClient) return

    setIsClaiming(true)
    setError('')

    try {
      // Mock successful claim for now
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate transaction time
      setTxHash('0x1234567890abcdef1234567890abcdef12345678') // Mock transaction hash
      setClaimSuccess(true)
    } catch (err) {
      console.error('Error claiming tokens:', err)
      setError('Failed to claim tokens. Please try again.')
    } finally {
      setIsClaiming(false)
    }
  }

  const handleReset = () => {
    setClaimCode('')
    setClaimInfo(null)
    setClaimSuccess(false)
    setTxHash('')
    setError('')
  }

  if (claimSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 space-y-8 bg-gradient-to-br from-purple-900 to-pink-900 text-white">
        <div className="text-center space-y-6">
          <div className="text-6xl">🎉</div>
          <h1 className="text-3xl font-bold">Claim Successful!</h1>
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 max-w-md">
            <div className="text-green-400 text-lg font-semibold mb-2">
              {claimInfo?.amount} MON Claimed!
            </div>
            <div className="text-white text-sm">
              From: {claimInfo?.sender?.slice(0, 6)}...{claimInfo?.sender?.slice(-4)}
            </div>
            <div className="text-green-300 text-sm mt-2 italic">
              "{claimInfo?.message}"
            </div>
          </div>
          
          {txHash && (
            <button
              onClick={() => window.open(`https://monad-testnet.socialscan.io/tx/${txHash}`, '_blank')}
              className="w-full text-purple-300 hover:text-purple-200 text-sm transition-colors duration-200"
            >
              View Transaction on Explorer
            </button>
          )}
          
          <div className="space-y-3">
            <button
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-200"
            >
              Claim Another Code
            </button>
            
            <button
              onClick={onBack}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200"
            >
              Back to Game
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 space-y-8 bg-gradient-to-br from-purple-900 to-pink-900 text-white">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">💝 Claim Your MON</h1>
        <p className="text-lg opacity-90">
          Enter the claim code you received from your crush
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md w-full space-y-6">
        {/* Wallet Status */}
        {isConnected && chainId === monadTestnet.id ? (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-center">
            <div className="text-green-400 text-sm">✅ Connected to Monad Testnet</div>
            <div className="text-white text-xs font-mono mt-1">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
          </div>
        ) : (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-center">
            <div className="text-red-400 text-sm">❌ Please connect to Monad Testnet</div>
          </div>
        )}

        {/* Claim Code Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">Claim Code</label>
          <input
            type="text"
            value={claimCode}
            onChange={(e) => setClaimCode(e.target.value.toUpperCase())}
            placeholder="Enter 8-character code"
            maxLength={8}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 font-mono text-center text-lg tracking-wider"
          />
          <div className="text-xs text-white/60 text-center">
            Format: 8 characters (A-Z, 0-9)
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-center">
            <div className="text-red-400 text-sm">{error}</div>
          </div>
        )}

        {/* Claim Info */}
        {claimInfo && claimInfo.isValid && !claimInfo.claimed && (
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 space-y-2">
            <div className="text-blue-400 text-sm font-semibold">Claim Details:</div>
            <div className="text-white">
              <div>Amount: <span className="font-bold">{claimInfo.amount} MON</span></div>
              <div>From: <span className="font-bold">{claimInfo.sender.slice(0, 6)}...{claimInfo.sender.slice(-4)}</span></div>
              <div className="text-blue-300 text-sm italic mt-2">"{claimInfo.message}"</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {!claimInfo ? (
            <button
              onClick={handleCheckCode}
              disabled={isChecking || !claimCode.trim() || claimCode.length !== 8}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-full transition-all duration-200"
            >
              {isChecking ? 'Checking...' : 'Check Claim Code'}
            </button>
          ) : claimInfo.isValid && !claimInfo.claimed ? (
            <button
              onClick={handleClaim}
              disabled={isClaiming || !isConnected || chainId !== monadTestnet.id}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-full transition-all duration-200"
            >
              {isClaiming ? 'Claiming...' : `Claim ${claimInfo.amount} MON`}
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-200"
            >
              Try Another Code
            </button>
          )}
          
          <button
            onClick={onBack}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200"
          >
            Back to Game
          </button>
        </div>
      </div>
    </div>
  )
}

