'use client'

import { FrameProvider } from './farcaster-provider'
import { WalletProvider } from './wallet-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <FrameProvider>{children}</FrameProvider>
    </WalletProvider>
  )
}
