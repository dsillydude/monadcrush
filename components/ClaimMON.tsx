'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useSwitchChain, useConnect } from 'wagmi'
import { monadTestnet } from 'viem/chains'
import { farcasterFrame } from '@farcaster/frame-wagmi-connector'
import { useFrame } from '@/components/farcaster-provider'
import { keccak256, toBytes } from 'viem'
import { 
  isValidClaimCode, 
  formatMONAmount,
  getClaim
} from '@/lib/token-transfer'
import { CONTRACT_ADDRESSES, ESCROW_ABI } from '@/lib/contracts'

export function ClaimMON() {
  const [claimCode, setClaimCode] = useState('')
  const [claimStatus, setClaimStatus] = useState<'idle' | 'checking' | 'claiming' | 'success' | 'error'>('idle')
  const [claimData, setClaimData] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const { isEthProviderAvailable } = useFrame()
  const { isConnected, address, chainId } = useAccount()
  const { connect } = useConnect()
  const { switchChain } = useSwitchChain()
  const { writeContract, data: hash, isPending } = useWriteContract()

  const handleCheckClaim = async () => {
    if (!claimCode.trim() || !isValidClaimCode(claimCode)) {
      setErrorMessage('Please enter a valid 8-character claim code')
      setClaimStatus('error')
      return
    }

    setClaimStatus('checking')
    setErrorMessage('')

    try {
      const claim = await getClaim(claimCode.toUpperCase())
      if (claim && !claim.claimed) {
        setClaimData(claim)
        setClaimStatus('idle')
      } else {
        setErrorMessage('Invalid or already claimed code')
        setClaimStatus('error')
      }
    } catch (error) {
      setErrorMessage('Failed to check claim code')
      setClaimStatus('error')
    }
  }

  const handleClaim = async () => {
    if (!isConnected) {
      if (isEthProviderAvailable) {
        connect({ connector: farcasterFrame() })
      } else {
        setErrorMessage('Wallet connection only available via Warpcast')
        setClaimStatus('error')
      }
      return
    }

    if (chainId !== monadTestnet.id) {
      switchChain({ chainId: monadTestnet.id })
      return
    }

    if (!claimData) return

    setClaimStatus('claiming')
    setErrorMessage('')

    try {
      const claimCodeHash = keccak256(toBytes(claimCode))
      
      writeContract({
        address: CONTRACT_ADDRESSES.PRODUCTION.MONAD_CRUSH_ESCROW as `0x${string}`,
        abi: ESCROW_ABI,
        functionName: 'claimTokens',
        args: [claimCodeHash]
      })

      setClaimStatus('success')
    } catch (error) {
      console.error('Claim error:', error)
      setErrorMessage('Failed to claim tokens')
      setClaimStatus('error')
    }
  }

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet to Claim'
    if (chainId !== monadTestnet.id) return 'Switch to Monad Testnet'
    if (claimStatus === 'checking') return 'Checking...'
    if (claimStatus === 'claiming' || isPending) return 'Claiming...'
    if (claimStatus === 'success') return 'Claimed! 🎉'
    if (claimData) return `Claim ${formatMONAmount(claimData.amount)}`
    return 'Check Claim Code'
  }

  const isDisabled = claimStatus === 'checking' || claimStatus === 'claiming' || isPending || claimStatus === 'success'

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">Claim Code</label>
        <input
          type="text"
          value={claimCode}
          onChange={(e) => setClaimCode(e.target.value.toUpperCase())}
          placeholder="Enter 8-character code"
          maxLength={8}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 font-mono text-center"
        />
      </div>

      {claimData && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
          <div className="text-blue-400 text-sm font-semibold mb-1">Claim Details:</div>
          <div className="text-white text-sm">
            <div>Amount: {formatMONAmount(claimData.amount)}</div>
            <div>From: @{claimData.recipientUsername}</div>
            <div className="text-blue-300 italic mt-1">"{claimData.matchData.reason}"</div>
          </div>
        </div>
      )}

      {claimStatus === 'error' && errorMessage && (
        <div className="text-red-400 text-sm text-center">
          {errorMessage}
        </div>
      )}

      <button
        onClick={claimData ? handleClaim : handleCheckClaim}
        disabled={isDisabled || (!claimData && (!claimCode.trim() || claimCode.length !== 8))}
        className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-full transition-all duration-200"
      >
        {getButtonText()}
      </button>

      {hash && claimStatus === 'success' && (
        <button
          onClick={() => window.open(`https://monad-testnet.socialscan.io/tx/${hash}`, '_blank')}
          className="w-full text-purple-300 hover:text-purple-200 text-xs transition-colors duration-200"
        >
          View Transaction on Explorer
        </button>
      )}
    </div>
  )
}

