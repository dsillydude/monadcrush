'use client'

import { useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { TokenTransferService, MON_SEND_AMOUNTS, formatMONAmount } from '../lib/token-transfer'

interface Match {
  username: string
  compatibility: number
  reason: string
  avatar: string
  interests: string[]
}

interface MONTransferProps {
  match: Match
  onSuccess?: (claimCode: string) => void
}

export function MONTransfer({ match, onSuccess }: MONTransferProps) {
  const [isTransferring, setIsTransferring] = useState(false)
  const [transferStatus, setTransferStatus] = useState<'idle' | 'creating' | 'success' | 'error'>('idle')
  const [selectedAmount, setSelectedAmount] = useState('5')
  const [customAmount, setCustomAmount] = useState('')
  const [claimCode, setClaimCode] = useState('')
  const [txHash, setTxHash] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showAmountSelector, setShowAmountSelector] = useState(false)
  
  const { isConnected, address } = useAccount()
  const { data: walletClient } = useWalletClient()

  const getActualAmount = () => {
    return selectedAmount === 'custom' ? customAmount : selectedAmount
  }

  const handleSendMON = async () => {
    if (!isConnected || !address || !walletClient) {
      setErrorMessage('Please connect your wallet')
      setTransferStatus('error')
      return
    }

    const amount = getActualAmount()
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage('Please enter a valid amount')
      setTransferStatus('error')
      return
    }

    try {
      setIsTransferring(true)
      setTransferStatus('creating')
      setErrorMessage('')

      const transferService = new TokenTransferService(walletClient)
      
      // For demo purposes, we'll use a placeholder recipient address
      // In production, this would be the actual recipient's wallet address
      const recipientAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d1b5' // Placeholder
      
      const personalMessage = `You caught my eye in the Monad community! 💝 Compatibility: ${match.compatibility}%`
      
      const result = await transferService.createClaim(
        amount,
        recipientAddress,
        personalMessage,
        address
      )

      setClaimCode(result.claimCode)
      setTxHash(result.txHash)
      setTransferStatus('success')
      onSuccess?.(result.claimCode)
    } catch (error) {
      console.error('MON transfer error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send MON')
      setTransferStatus('error')
    } finally {
      setIsTransferring(false)
    }
  }

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet to Send'
    if (transferStatus === 'creating') return 'Creating Claim...'
    if (transferStatus === 'success') return 'MON Sent! 🎉'
    return '💜 Send MON'
  }

  const isDisabled = isTransferring || transferStatus === 'success'

  if (transferStatus === 'success' && claimCode) {
    return (
      <div className="space-y-3">
        <div className="bg-green-500/20 border border-green-400 rounded-lg p-4 text-center">
          <div className="text-green-400 font-bold text-lg mb-2">
            MON Sent Successfully! 🎉
          </div>
          <div className="text-sm text-green-300 mb-3">
            {formatMONAmount(getActualAmount())} sent to @{match.username}
          </div>
          
          <div className="bg-black/30 rounded-lg p-3 mb-3">
            <div className="text-xs text-gray-300 mb-1">Claim Code:</div>
            <div className="font-mono text-lg text-white tracking-wider">
              {claimCode}
            </div>
          </div>
          
          <div className="text-xs text-green-300">
            Share this code with @{match.username} to claim the MON tokens!
          </div>
        </div>

        {txHash && (
          <button
            onClick={() => window.open(`https://testnet.monadexplorer.com/tx/${txHash}`, '_blank')}
            className="w-full text-purple-300 hover:text-purple-200 text-xs transition-colors duration-200"
          >
            View Transaction on Explorer
          </button>
        )}

        <button
          onClick={() => {
            navigator.clipboard.writeText(`Hey @${match.username}! I sent you ${formatMONAmount(getActualAmount())} MON from MonCrush! Use claim code: ${claimCode}`)
            alert('Claim message copied to clipboard!')
          }}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded-lg transition-colors duration-200"
        >
          📋 Copy Claim Message
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {!showAmountSelector ? (
        <button
          onClick={() => setShowAmountSelector(true)}
          disabled={isDisabled}
          className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-full text-sm transition-all duration-200`}
        >
          {getButtonText()}
          {transferStatus !== 'success' && (
            <div className="text-xs opacity-75">To Crush</div>
          )}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="text-center text-sm text-white/80 mb-3">
            Select amount to send to @{match.username}:
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {MON_SEND_AMOUNTS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedAmount(option.value)}
                className={`py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                  selectedAmount === option.value
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {selectedAmount === 'custom' && (
            <input
              type="number"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 text-sm"
              min="0.1"
              step="0.1"
            />
          )}

          <div className="flex space-x-2">
            <button
              onClick={() => setShowAmountSelector(false)}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSendMON}
              disabled={isDisabled || !getActualAmount() || parseFloat(getActualAmount()) <= 0}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-2 px-3 rounded-lg text-sm transition-all duration-200"
            >
              Send {getActualAmount() ? formatMONAmount(getActualAmount()) : 'MON'}
            </button>
          </div>
        </div>
      )}

      {transferStatus === 'error' && errorMessage && (
        <div className="text-red-400 text-xs text-center">
          {errorMessage}
        </div>
      )}
    </div>
  )
}

