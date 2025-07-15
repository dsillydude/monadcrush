'use client'

import { useState } from 'react'

interface MockWalletConnectionProps {
  onConnected: () => void
}

export function MockWalletConnection({ onConnected }: MockWalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsConnected(true)
    setIsConnecting(false)
    
    // Auto-proceed after showing connected state
    setTimeout(() => {
      onConnected()
    }, 1000)
  }

  if (isConnected) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
          <div className="text-green-400 text-sm mb-2">✅ Wallet Connected</div>
          <div className="text-white text-xs font-mono">
            0x1234...5678
          </div>
          <div className="text-green-400 text-xs mt-1">Monad Testnet</div>
        </div>
        
        <div className="text-green-400 text-sm">
          Proceeding to game...
        </div>
      </div>
    )
  }

  return (
    <div className="text-center space-y-4">
      <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
        <div className="text-purple-400 text-sm mb-2">🔗 Connect Required</div>
        <div className="text-white text-xs">Connect your wallet to play MonadCrush</div>
      </div>
      
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-full text-lg transition-all duration-200"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet 🔗'}
      </button>
      
      <div className="text-gray-400 text-xs">
        (Mock connection for testing)
      </div>
    </div>
  )
}

