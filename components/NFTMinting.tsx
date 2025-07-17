'use client'

import { useState } from 'react'
import { useAccount, useWalletClient, usePublicClient } from 'wagmi'
import { monadTestnet } from 'viem/chains'
import { NFTService } from '../lib/nft-contract'

interface Match {
  username: string
  compatibility: number
  reason: string
  avatar: string
  interests: string[]
}

interface NFTMintingProps {
  match: Match
  onSuccess?: () => void
}

export function NFTMinting({ match, onSuccess }: NFTMintingProps) {
  const [isMinting, setIsMinting] = useState(false)
  const [mintStatus, setMintStatus] = useState<'idle' | 'uploading' | 'minting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [tokenId, setTokenId] = useState<number | null>(null)
  const [txHash, setTxHash] = useState('')
  
  const { isConnected, address, chainId } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const handleMintNFT = async () => {
    if (!isConnected || !address || !walletClient || !publicClient) {
      setErrorMessage('Please connect your wallet')
      setMintStatus('error')
      return
    }

    if (chainId !== monadTestnet.id) {
      setErrorMessage('Please switch to Monad Testnet')
      setMintStatus('error')
      return
    }

    try {
      setIsMinting(true)
      setMintStatus('uploading')
      setErrorMessage('')

      const nftService = new NFTService(walletClient, publicClient)
      
      setMintStatus('minting')
      
      const result = await nftService.mintMatchCard(match, address)
      
      setTokenId(result.tokenId)
      setTxHash(result.txHash)
      setMintStatus('success')
      onSuccess?.()
    } catch (error) {
      console.error('NFT minting error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to mint NFT')
      setMintStatus('error')
    } finally {
      setIsMinting(false)
    }
  }

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet to Mint'
    if (chainId !== monadTestnet.id) return 'Switch to Monad Testnet'
    if (mintStatus === 'uploading') return 'Uploading Metadata...'
    if (mintStatus === 'minting') return 'Minting NFT...'
    if (mintStatus === 'success') return 'NFT Minted! 🎉'
    return '💜 Mint NFT'
  }

  const isDisabled = isMinting || mintStatus === 'success'

  if (mintStatus === 'success' && tokenId) {
    return (
      <div className="space-y-3">
        <div className="bg-green-500/20 border border-green-400 rounded-lg p-4 text-center">
          <div className="text-green-400 font-bold text-lg mb-2">
            NFT Minted Successfully! 🎉
          </div>
          <div className="text-sm text-green-300 mb-3">
            Match card #{tokenId} for @{match.username}
          </div>
          <div className="text-xs text-green-300">
            Your MonCrush match card has been minted as an NFT!
          </div>
        </div>

        {txHash && (
          <button
            onClick={() => window.open(`https://monad-testnet.socialscan.io/tx/${txHash}`, '_blank')}
            className="w-full text-purple-300 hover:text-purple-200 text-xs transition-colors duration-200"
          >
            View Transaction on Explorer
          </button>
        )}

        <button
          onClick={() => {
            navigator.clipboard.writeText(`I just minted my MonCrush match card NFT for @${match.username}! ${match.compatibility}% compatibility 💘`)
            alert('Share message copied to clipboard!')
          }}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded-lg transition-colors duration-200"
        >
          📋 Share Your NFT
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleMintNFT}
        disabled={isDisabled}
        className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-full text-sm transition-all duration-200 ${
          mintStatus === 'success' ? 'from-green-500 to-green-600' : ''
        }`}
      >
        {getButtonText()}
        {mintStatus !== 'success' && (
          <div className="text-xs opacity-75">0.01 MON</div>
        )}
      </button>

      {mintStatus === 'error' && errorMessage && (
        <div className="text-red-400 text-xs text-center">
          {errorMessage}
        </div>
      )}
    </div>
  )
}

