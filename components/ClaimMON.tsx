'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useSwitchChain, useConnect } from 'wagmi'
import { monadTestnet } from 'viem/chains'
import { farcasterFrame } from '@farcaster/frame-wagmi-connector'
import { useFrame } from '@/components/farcaster-provider'
import { 
  ESCROW_CONTRACT, 
  isValidClaimCode, 
  formatMONAmount,
  getClaim
} from '@/lib/token-transfer'

export function ClaimMON() {
  const [claimCode, setClaimCode] = useState('')
  const [claimStatus, setClaimStatus] = useState<'idle' | 'checking' | 'claiming' | 'success' | 'error'>('idle')
  const [claimData, setClaimData] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isClaiming, setIsClaiming] = useState(false)
  
  const { isEthProviderAvailable } = useFrame()
  const { isConnected, address, chainId } = useAccount()
  const { connect } = useConnect()
  const { switchChain } = useSwitchChain()
  const { writeContract, data: hash, isPending } = useWriteContract()

  const handleCheckClaim = async () => {
    if (!claimCode || !isValidClaimCode(claimCode)) {
      setErrorMessage('Please enter a valid 8-character claim code')
      setClaimStatus('error')
      return
    }

    try {
      setClaimStatus('checking')
      setErrorMessage('')

      const claim = await getClaim(claimCode)
      
      if (!claim) {
        setErrorMessage('Claim code not found or invalid')
        setClaimStatus('error')
        return
      }

      if (claim.claimed) {
        setErrorMessage('This claim code has already been used')
        setClaimStatus('error')
        return
      }

      setClaimData(claim)
      setClaimStatus('idle') // Ready to claim
    } catch (error) {
      console.error('Error checking claim:', error)
      setErrorMessage('Failed to check claim code')
      setClaimStatus('error')
    }
  }

  const handleClaimTokens = async () => {
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

    try {
      setIsClaiming(true)
      setClaimStatus('claiming')
      setErrorMessage('')

      // Claim tokens from escrow
      writeContract({
        address: ESCROW_CONTRACT.address,
        abi: ESCROW_CONTRACT.abi,
        functionName: 'claimTokens',
        args: [claimCode]
      })

      setClaimStatus('success')
    } catch (error) {
      console.error('Claim error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to claim tokens')
      setClaimStatus('error')
    } finally {
      setIsClaiming(false)
    }
  }

  const getClaimButtonText = () => {
    if (!isConnected) return 'Connect Wallet to Claim'
    if (chainId !== monadTestnet.id) return 'Switch to Monad Testnet'
    if (claimStatus === 'claiming' || isPending) return 'Claiming Tokens...'
    if (claimStatus === 'success') return 'Tokens Claimed! 🎉'
    return `Claim ${claimData ? formatMONAmount(claimData.amount) : 'MON'}`
  }

  const isClaimDisabled = isClaiming || isPending || claimStatus === 'success' || !claimData

  if (claimStatus === 'success') {
    return (
      <div className="bg-green-500/20 border border-green-400 rounded-lg p-6 text-center">
        <div className="text-green-400 font-bold text-xl mb-2">
          🎉 Tokens Claimed Successfully!
        </div>
        <div className="text-green-300 mb-4">
          You've received {claimData ? formatMONAmount(claimData.amount) : ''} MON tokens!
        </div>
        
        {hash && (
          <button
            onClick={() => window.open(`https://testnet.monadexplorer.com/tx/${hash}`, '_blank')}
            className="text-green-300 hover:text-green-200 text-sm transition-colors duration-200"
          >
            View Transaction on Explorer
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">💰 Claim MON Tokens</h2>
        <p className="text-white/70 text-sm">
          Enter your claim code to receive MON tokens from your MonCrush match!
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-white/80 text-sm mb-2">Claim Code</label>
          <input
            type="text"
            placeholder="Enter 8-character code"
            value={claimCode}
            onChange={(e) => setClaimCode(e.target.value.toUpperCase())}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-3 text-white placeholder-white/50 font-mono text-center tracking-wider"
            maxLength={8}
          />
        </div>

        {!claimData ? (
          <button
            onClick={handleCheckClaim}
            disabled={claimStatus === 'checking' || !claimCode}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
          >
            {claimStatus === 'checking' ? 'Checking...' : 'Check Claim Code'}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="bg-purple-500/20 border border-purple-400 rounded-lg p-4">
              <div className="text-center">
                <div className="text-purple-300 font-bold text-lg">
                  {formatMONAmount(claimData.amount)} MON
                </div>
                <div className="text-purple-200 text-sm">
                  From @{claimData.senderAddress?.slice(0, 6)}...{claimData.senderAddress?.slice(-4)}
                </div>
                {claimData.matchData && (
                  <div className="text-purple-200 text-xs mt-2">
                    MonCrush Match: {claimData.matchData.compatibility}% compatibility
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleClaimTokens}
              disabled={isClaimDisabled}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
            >
              {getClaimButtonText()}
            </button>
          </div>
        )}

        {claimStatus === 'error' && errorMessage && (
          <div className="text-red-400 text-sm text-center">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  )
}

