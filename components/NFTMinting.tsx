import { useState } from 'react'
import { useAccount, useWriteContract, useSwitchChain, useConnect } from 'wagmi'
import { parseEther } from 'viem'
import { monadTestnet } from 'viem/chains'
import { farcasterFrame } from '@farcaster/frame-wagmi-connector'
import { useFrame } from './farcaster-provider'
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
  
  const { isEthProviderAvailable } = useFrame()
  const { isConnected, address, chainId } = useAccount()
  const { connect } = useConnect()
  const { switchChain } = useSwitchChain()
  const { writeContract, data: hash, isPending } = useWriteContract()

  const handleMintNFT = async () => {
    if (!isConnected) {
      if (isEthProviderAvailable) {
        connect({ connector: farcasterFrame() })
      } else {
        setErrorMessage('Wallet connection only available via Warpcast')
        setMintStatus('error')
      }
      return
    }

    if (chainId !== monadTestnet.id) {
      switchChain({ chainId: monadTestnet.id })
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

      // Mint the NFT
      writeContract({
        address: MONADCRUSH_NFT_CONTRACT.address,
        abi: MONADCRUSH_NFT_CONTRACT.abi,
        functionName: 'mint',
        args: [address!, tokenURI],
        value: parseEther('0.01') // 0.01 MON
      })

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
    if (mintStatus === 'minting' || isPending) return 'Minting NFT...'
    if (mintStatus === 'success') return 'NFT Minted! 🎉'
    return '💜 Mint NFT'
  }

  const isDisabled = isMinting || isPending || mintStatus === 'success'

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

      {hash && mintStatus === 'success' && (
        <button
          onClick={() => window.open(`https://testnet.monadexplorer.com/tx/${hash}`, '_blank')}
          className="w-full text-purple-300 hover:text-purple-200 text-xs transition-colors duration-200"
        >
          View Transaction on Explorer
        </button>
      )}

      {mintStatus === 'success' && (
        <div className="text-center text-xs text-green-400">
          Your MonCrush match card has been minted as an NFT! 🎉
        </div>
      )}
    </div>
  )
}

