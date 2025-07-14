'use client'

import { useState } from 'react'

interface Question {
  id: number
  text: string
  options: string[]
}

const questions: Question[] = [
  {
    id: 1,
    text: "What's one thing you LOVE about Monad?",
    options: [
      "The parallel execution model is revolutionary!",
      "EVM compatibility with 10,000x performance gains",
      "The developer experience and tooling ecosystem",
      "The community and vision for the future"
    ]
  },
  {
    id: 2,
    text: "What's your favorite Monad-related meme or inside joke?",
    options: [
      "Monad go brrrr (but actually fast)",
      "When other chains are slow, we're already done",
      "Parallel execution = parallel relationships",
      "Monad: Making Ethereum look like dial-up"
    ]
  },
  {
    id: 3,
    text: "If Monad were a superpower, what would it be and why?",
    options: [
      "Time manipulation - because we process transactions in parallel time",
      "Super speed - 10,000 TPS speaks for itself",
      "Mind reading - knowing what developers need before they ask",
      "Multiplication - turning one transaction into many simultaneously"
    ]
  }
]

interface Match {
  username: string
  compatibility: number
  reason: string
}

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [gameState, setGameState] = useState<'intro' | 'questions' | 'matching' | 'result'>('intro')
  const [match, setMatch] = useState<Match | null>(null)

  const handleStartGame = () => {
    setGameState('questions')
  }

  const handleAnswerSubmit = () => {
    if (selectedOption === null) return
    
    const newAnswers = [...answers, selectedOption]
    setAnswers(newAnswers)
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
    } else {
      setGameState('matching')
      // Simulate matching process
      setTimeout(() => {
        const mockMatch: Match = {
          username: 'monad_dev',
          compatibility: Math.floor(Math.random() * 20) + 80, // 80-99% compatibility
          reason: "You both love Monad's parallel execution model. Soulmates!"
        }
        setMatch(mockMatch)
        setGameState('result')
      }, 2000)
    }
  }

  const handleShare = () => {
    alert('Share functionality - would post to Farcaster in production!')
  }

  const handleMintNFT = () => {
    alert('NFT minting - would mint match card on Monad for 0.01 MON!')
  }

  const handleSendMON = () => {
    const claimCode = Math.floor(1000 + Math.random() * 9000) // Generate 4-digit code
    alert(`MON sending - Claim code: ${claimCode}. Your crush can use this code to claim MON tokens!`)
  }

  if (gameState === 'intro') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 space-y-8 bg-gradient-to-br from-purple-900 to-pink-900 text-white">
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3 mb-4 text-center text-sm">
          🚧 Development Mode - Use in Farcaster app for full functionality
        </div>
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">💘 MonCrush</h1>
          <p className="text-lg opacity-90">
            Find your perfect match through code, vibes, and a little onchain fate.
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">How it works:</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <span className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
              <span>Answer 3 questions about Monad</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
              <span>Get matched with compatible users</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
              <span>Mint NFTs or send MON to your crush</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleStartGame}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-200 transform hover:scale-105"
        >
          Find My MonCrush 💘
        </button>
      </div>
    )
  }

  if (gameState === 'questions') {
    const question = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <div className="flex min-h-screen flex-col p-6 bg-gradient-to-br from-purple-900 to-pink-900 text-white">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm opacity-75">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-sm opacity-75">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-8">{question.text}</h2>
            
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedOption(index)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedOption === index
                      ? 'bg-pink-500/30 border-pink-400 text-white'
                      : 'bg-white/10 border-white/20 text-white/90 hover:bg-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === index ? 'border-pink-400 bg-pink-400' : 'border-white/40'
                    }`}>
                      {selectedOption === index && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="text-sm">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleAnswerSubmit}
          disabled={selectedOption === null}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-full text-lg transition-all duration-200"
        >
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'Find My Match!'}
        </button>
      </div>
    )
  }

  if (gameState === 'matching') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 space-y-8 bg-gradient-to-br from-purple-900 to-pink-900 text-white">
        <div className="text-center space-y-4">
          <div className="animate-spin text-6xl">💘</div>
          <h2 className="text-2xl font-bold">Finding your MonCrush...</h2>
          <p className="text-lg opacity-75">Analyzing compatibility with the Monad community</p>
        </div>
        
        <div className="space-y-2 text-center text-sm opacity-60">
          <div>🔍 Scanning responses...</div>
          <div>🧠 Computing compatibility scores...</div>
          <div>💫 Finding your perfect match...</div>
        </div>
      </div>
    )
  }

  if (gameState === 'result' && match) {
    return (
      <div className="flex min-h-screen flex-col p-6 bg-gradient-to-br from-purple-900 to-pink-900 text-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">💘 YOU'VE GOT A MONCRUSH!</h1>
          <div className="text-6xl font-bold text-pink-300">{match.compatibility}%</div>
          <div className="text-lg opacity-75">Compatibility</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div className="text-2xl">💕</div>
            <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-2xl">
              {match.username[0].toUpperCase()}
            </div>
          </div>
          
          <div className="text-center">
            <div className="font-semibold text-lg mb-2">@{match.username}</div>
            <div className="text-sm opacity-75 italic">"{match.reason}"</div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-full text-lg transition-all duration-200"
          >
            📢 Share Your Match
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleMintNFT}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-full text-sm transition-all duration-200"
            >
              💜 Mint NFT
              <div className="text-xs opacity-75">0.01 MON</div>
            </button>
            
            <button
              onClick={handleSendMON}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-full text-sm transition-all duration-200"
            >
              💜 Send MON
              <div className="text-xs opacity-75">To Crush</div>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setGameState('intro')
              setCurrentQuestion(0)
              setAnswers([])
              setSelectedOption(null)
              setMatch(null)
            }}
            className="text-white/60 hover:text-white transition-colors duration-200"
          >
            🔄 Play Again Tomorrow
          </button>
        </div>
      </div>
    )
  }

  return null
}

