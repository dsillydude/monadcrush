'use client'

import { useFrame } from '@/components/farcaster-provider'
import { farcasterFrame } from '@farcaster/frame-wagmi-connector'
import { monadTestnet } from 'viem/chains'
import {
  useAccount,
  useConnect,
  useSwitchChain,
} from 'wagmi'

interface WalletConnectionProps {
  onConnected: () => void
}

export function WalletConnection({ onConnected }: WalletConnectionProps) {
  const { isEthProviderAvailable } = useFrame()
  const { isConnected, address, chainId } = useAccount()
  const { switchChain } = useSwitchChain()
  const { connect } = useConnect()

  const handleConnect = () => {
    if (isConnected && chainId === monadTestnet.id) {
      onConnected()
    } else if (isConnected && chainId !== monadTestnet.id) {
      switchChain({ chainId: monadTestnet.id })
    } else {
      connect({ connector: farcasterFrame() })
    }
  }

  // Auto-proceed if already connected to Monad Testnet
  if (isConnected && chainId === monadTestnet.id) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
          <div className="text-green-400 text-sm mb-2">✅ Wallet Connected</div>
          <div className="text-white text-xs font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
          <div className="text-green-400 text-xs mt-1">Monad Testnet</div>
        </div>
        
        <button
          onClick={onConnected}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-full text-lg transition-all duration-200"
        >
          Continue to Game 🎮
        </button>
      </div>
    )
  }

  if (isConnected && chainId !== monadTestnet.id) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="text-yellow-400 text-sm mb-2">⚠️ Wrong Network</div>
          <div className="text-white text-xs">Please switch to Monad Testnet</div>
        </div>
        
        <button
          onClick={() => switchChain({ chainId: monadTestnet.id })}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-full text-lg transition-all duration-200"
        >
          Switch to Monad Testnet 🔄
        </button>
      </div>
    )
  }

  if (isEthProviderAvailable) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
          <div className="text-purple-400 text-sm mb-2">🔗 Connect Required</div>
          <div className="text-white text-xs">Connect your wallet to play MonadCrush</div>
        </div>
        
        <button
          onClick={handleConnect}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-full text-lg transition-all duration-200"
        >
          Connect Wallet 🔗
        </button>
      </div>
    )
  }

  return (
    <div className="text-center space-y-4">
      <div className="bg-gray-500/20 border border-gray-500/30 rounded-lg p-4">
        <div className="text-gray-400 text-sm mb-2">📱 Warpcast Required</div>
        <div className="text-white text-xs">Wallet connection only available via Warpcast</div>
      </div>
      
      <div className="text-gray-400 text-sm">
        Please open this app in Warpcast to connect your wallet
      </div>
    </div>
  )
}

