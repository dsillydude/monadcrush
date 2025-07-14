import { ClaimMON } from '@/components/ClaimMON'

export default function ClaimPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 to-pink-900 text-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">💰 MonCrush</h1>
          <p className="text-lg opacity-90">
            Claim your MON tokens from your crush!
          </p>
        </div>
        
        <ClaimMON />
        
        <div className="mt-8 text-center">
          <a 
            href="/"
            className="text-purple-300 hover:text-purple-200 text-sm transition-colors duration-200"
          >
            ← Back to MonCrush
          </a>
        </div>
      </div>
    </div>
  )
}

