'use client'

import { useState } from 'react'
import { useAccount, useWalletClient, usePublicClient } from 'wagmi'
import { parseEther } from 'viem'
import { monadTestnet } from 'viem/chains'
import { MONADCRUSH_NFT_CONTRACT, generateMatchNFTMetadata, uploadToIPFS } from '../lib/nft-contract'

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
  const [txHash, setTxHash] = useState('')
  const [tokenId, setTokenId] = useState<number | null>(null)
  
  const { isConnected, address, chainId } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const handleMintNFT = async () => {
    if (!isConnected || !address || !walletClient) {
      setErrorMessage('Please connect your wallet')
      setMintStatus('error')
      return
    }

    if (chainId !== monadTestnet.id) {
      setErrorMessage('Please switch to Monad Testnet')
      setMintStatus('error')
      return
    }

    // Check if NFT contract is deployed
    if (MONADCRUSH_NFT_CONTRACT.address === '0x0000000000000000000000000000000000000000') {
      setErrorMessage('NFT contract not deployed yet. Please deploy the contract first.')
      setMintStatus('error')
      return
    }

    try {
      setIsMinting(true)
      setMintStatus('uploading')
      setErrorMessage('')

      // Generate and upload metadata
      const metadata = generateMatchNFTMetadata(match)
      const tokenURI = await uploadToIPFS(metadata)

      setMintStatus('minting')

      // Get mint price from contract
      const mintPrice = await publicClient?.readContract({
        address: MONADCRUSH_NFT_CONTRACT.address as `0x${string}`,
        abi: MONADCRUSH_NFT_CONTRACT.abi,
        functionName: 'mintPrice'
      })

      // Mint the NFT
      const hash = await walletClient.writeContract({
        address: MONADCRUSH_NFT_CONTRACT.address as `0x${string}`,
        abi: MONADCRUSH_NFT_CONTRACT.abi,
        functionName: 'mint',
        args: [address, tokenURI],
        value: mintPrice || parseEther('0.01'), // Fallback to 0.01 MON
        account: address
      })

      setTxHash(hash)

      // Wait for transaction confirmation
      const receipt = await publicClient?.waitForTransactionReceipt({ hash })
      
      if (receipt) {
        // Extract token ID from logs if available
        const mintEvent = receipt.logs.find(log => 
          log.address.toLowerCase() === MONADCRUSH_NFT_CONTRACT.address.toLowerCase()
        )
        
        if (mintEvent && mintEvent.topics[2]) {
          const tokenIdHex = mintEvent.topics[2]
          setTokenId(parseInt(tokenIdHex, 16))
        }
      }

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
    return '🎨 Mint Match Card'
  }

  const isDisabled = isMinting || mintStatus === 'success' || 
                    MONADCRUSH_NFT_CONTRACT.address === '0x0000000000000000000000000000000000000000'

  if (mintStatus === 'success') {
    return (
      <div className="space-y-3">
        <div className="bg-green-500/20 border border-green-400 rounded-lg p-4 text-center">
          <div className="text-green-400 font-bold text-lg mb-2">
            NFT Minted Successfully! 🎉
          </div>
          <div className="text-sm text-green-300 mb-3">
            Your MonCrush match card has been created!
          </div>
          
          {tokenId && (
            <div className="bg-black/30 rounded-lg p-3 mb-3">
              <div className="text-xs text-gray-300 mb-1">Token ID:</div>
              <div className="font-mono text-lg text-white">
                #{tokenId}
              </div>
            </div>
          )}
          
          <div className="text-xs text-green-300">
            Match: @{match.username} ({match.compatibility}% compatibility)
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

        <div className="text-center text-xs text-green-400">
          Your match card is now a collectible NFT! 🎨
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleMintNFT}
        disabled={isDisabled}
        className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-full text-sm transition-all duration-200`}
      >
        {getButtonText()}
        {mintStatus !== 'success' && !isDisabled && (
          <div className="text-xs opacity-75">0.01 MON</div>
        )}
      </button>

      {mintStatus === 'error' && errorMessage && (
        <div className="text-red-400 text-xs text-center">
          {errorMessage}
        </div>
      )}

      {MONADCRUSH_NFT_CONTRACT.address === '0x0000000000000000000000000000000000000000' && (
        <div className="text-yellow-400 text-xs text-center">
          ⚠️ NFT contract not deployed yet
        </div>
      )}

      {mintStatus === 'uploading' && (
        <div className="text-center text-xs text-blue-400">
          📤 Uploading match data to IPFS...
        </div>
      )}

      {mintStatus === 'minting' && (
        <div className="text-center text-xs text-purple-400">
          ⛏️ Creating your unique match card NFT...
        </div>
      )}
    </div>
  )
}

