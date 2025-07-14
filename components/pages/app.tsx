
'use client'

import { useState } from 'react'
import { NFTMinting } from '@/components/NFTMinting'
import { MONTransfer } from '@/components/MONTransfer'

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
  },
  {
    id: 4,
    text: "What's your ideal way to contribute to the Monad ecosystem?",
    options: [
      "Building innovative dApps and smart contracts",
      "Fostering a vibrant and inclusive community",
      "Researching and advancing blockchain scalability solutions",
      "Creating engaging content and educational resources"
    ]
  },
  {
    id: 5,
    text: "If you could only pick one, what's the most exciting aspect of Monad's future?",
    options: [
      "The potential for mass adoption and mainstream integration",
      "The continuous innovation in parallel EVM technology",
      "The growth of a strong, passionate global community",
      "The emergence of groundbreaking new use cases and applications"
    ]
  },
  {
    id: 6,
    text: "How do you prefer to stay updated on Monad news and developments?",
    options: [
      "Diving deep into technical documentation and whitepapers",
      "Engaging in community discussions on Discord and Farcaster",
      "Following official announcements and core team updates",
      "Exploring new projects and dApps built on Monad"
    ]
  }
]

interface Match {
  username: string
  compatibility: number
  reason: string
  avatar: string
  interests: string[]
}

interface PersonalityProfile {
  technical: number    // 0-100: How technical/developer-focused
  community: number    // 0-100: How community/social-focused  
  innovation: number   // 0-100: How innovation/future-focused
  humor: number       // 0-100: How humor/meme-focused
}

// Diverse pool of potential matches with personality profiles
const matchPool = [
  {
    username: "monad_dev",
    avatar: "👨‍💻",
    interests: ["DeFi", "Smart Contracts", "Parallel Execution"],
    personality: { technical: 95, community: 60, innovation: 85, humor: 40 }
  },
  {
    username: "crypto_queen",
    avatar: "👑",
    interests: ["NFTs", "Community Building", "Memes"],
    personality: { technical: 30, community: 95, innovation: 70, humor: 90 }
  },
  {
    username: "blockchain_bae",
    avatar: "💎",
    interests: ["Trading", "Technology", "Innovation"],
    personality: { technical: 75, community: 50, innovation: 90, humor: 60 }
  },
  {
    username: "defi_darling",
    avatar: "🌟",
    interests: ["DeFi", "Yield Farming", "Community"],
    personality: { technical: 80, community: 85, innovation: 75, humor: 55 }
  },
  {
    username: "web3_wizard",
    avatar: "🧙‍♂️",
    interests: ["dApps", "Smart Contracts", "Future Tech"],
    personality: { technical: 90, community: 40, innovation: 95, humor: 70 }
  },
  {
    username: "nft_ninja",
    avatar: "🥷",
    interests: ["NFTs", "Art", "Community"],
    personality: { technical: 45, community: 80, innovation: 85, humor: 75 }
  },
  {
    username: "monad_memer",
    avatar: "😂",
    interests: ["Memes", "Community", "Fun"],
    personality: { technical: 25, community: 90, innovation: 60, humor: 95 }
  },
  {
    username: "parallel_prince",
    avatar: "⚡",
    interests: ["Performance", "Scaling", "Technology"],
    personality: { technical: 85, community: 55, innovation: 80, humor: 45 }
  },
  {
    username: "chain_charmer",
    avatar: "✨",
    interests: ["Interoperability", "Innovation", "Community"],
    personality: { technical: 70, community: 75, innovation: 90, humor: 65 }
  },
  {
    username: "gas_goddess",
    avatar: "⛽",
    interests: ["Efficiency", "Optimization", "DeFi"],
    personality: { technical: 80, community: 60, innovation: 75, humor: 50 }
  }
]

// Calculate personality profile based on user answers
function calculatePersonalityProfile(answers: number[]): PersonalityProfile {
  let technical = 0
  let community = 0
  let innovation = 0
  let humor = 0

  // Question 1: What you love about Monad
  switch (answers[0]) {
    case 0: // Parallel execution model
      technical += 40
      innovation += 35
      break
    case 1: // EVM compatibility with performance
      technical += 35
      innovation += 30
      break
    case 2: // Developer experience
      technical += 30
      community += 25
      break
    case 3: // Community and vision
      community += 40
      innovation += 25
      break
  }

  // Question 2: Favorite meme/joke
  switch (answers[1]) {
    case 0: // Monad go brrrr
      humor += 35
      technical += 20
      break
    case 1: // When other chains are slow
      humor += 30
      technical += 25
      break
    case 2: // Parallel execution = parallel relationships
      humor += 40
      community += 20
      break
    case 3: // Making Ethereum look like dial-up
      humor += 35
      innovation += 20
      break
  }

  // Question 3: Monad superpower
  switch (answers[2]) {
    case 0: // Time manipulation
      innovation += 35
      technical += 20
      break
    case 1: // Super speed
      technical += 30
      innovation += 25
      break
    case 2: // Mind reading
      community += 35
      innovation += 20
      break
    case 3: // Multiplication
      technical += 25
      innovation += 30
      break
  }

  // Question 4: Ideal way to contribute
  switch (answers[3]) {
    case 0: // Building innovative dApps
      technical += 35
      innovation += 30
      break
    case 1: // Fostering community
      community += 40
      break
    case 2: // Researching scalability
      technical += 30
      innovation += 35
      break
    case 3: // Creating engaging content
      community += 25
      humor += 20
      break
  }

  // Question 5: Most exciting aspect of Monad's future
  switch (answers[4]) {
    case 0: // Mass adoption
      community += 30
      innovation += 25
      break
    case 1: // Continuous innovation in parallel EVM
      technical += 35
      innovation += 30
      break
    case 2: // Growth of community
      community += 40
      break
    case 3: // Groundbreaking new use cases
      innovation += 35
      technical += 20
      break
  }

  // Question 6: How to stay updated
  switch (answers[5]) {
    case 0: // Technical documentation
      technical += 30
      break
    case 1: // Community discussions
      community += 35
      break
    case 2: // Official announcements
      community += 20
      innovation += 15
      break
    case 3: // Exploring new projects
      technical += 25
      innovation += 20
      break
  }

  // Normalize to 0-100 scale and add some randomness for variety
  return {
    technical: Math.min(100, technical + Math.random() * 10),
    community: Math.min(100, community + Math.random() * 10),
    innovation: Math.min(100, innovation + Math.random() * 10),
    humor: Math.min(100, humor + Math.random() * 10)
  }
}

// Calculate compatibility between two personality profiles
function calculateCompatibility(userProfile: PersonalityProfile, matchProfile: PersonalityProfile): number {
  // Calculate similarity in each dimension (closer = higher compatibility)
  const technicalSimilarity = 100 - Math.abs(userProfile.technical - matchProfile.technical)
  const communitySimilarity = 100 - Math.abs(userProfile.community - matchProfile.community)
  const innovationSimilarity = 100 - Math.abs(userProfile.innovation - matchProfile.innovation)
  const humorSimilarity = 100 - Math.abs(userProfile.humor - matchProfile.humor)

  // Weighted average (you can adjust weights based on importance)
  const compatibility = (
    technicalSimilarity * 0.3 +
    communitySimilarity * 0.25 +
    innovationSimilarity * 0.25 +
    humorSimilarity * 0.2
  )

  // Add some randomness to make it feel more natural (±10%)
  const randomFactor = (Math.random() - 0.5) * 20
  return Math.max(60, Math.min(99, Math.round(compatibility + randomFactor)))
}

// Generate compatibility reason based on profiles and answers
function generateCompatibilityReason(
  userProfile: PersonalityProfile, 
  match: any, 
  compatibility: number,
  answers: number[]
): string {
  const reasons = []

  // High compatibility reasons
  if (compatibility >= 85) {
    if (Math.abs(userProfile.technical - match.personality.technical) < 20) {
      reasons.push("You both share a deep appreciation for Monad's technical excellence!")
    }
    if (Math.abs(userProfile.community - match.personality.community) < 20) {
      reasons.push("Your community vibes are perfectly aligned!")
    }
    if (Math.abs(userProfile.innovation - match.personality.innovation) < 20) {
      reasons.push("You both see the revolutionary potential of Monad!")
    }
    if (Math.abs(userProfile.humor - match.personality.humor) < 20) {
      reasons.push("Your sense of humor about crypto is perfectly matched!")
    }
  }

  // Medium compatibility reasons
  if (compatibility >= 75 && compatibility < 85) {
    reasons.push("You complement each other's Monad journey beautifully!")
    reasons.push("Your different perspectives on Monad create perfect balance!")
    reasons.push("You both appreciate what makes Monad special!")
  }

  // Lower compatibility but still positive
  if (compatibility < 75) {
    reasons.push("Opposites attract in the Monad ecosystem!")
    reasons.push("Your different Monad interests could spark great conversations!")
    reasons.push("Sometimes the best matches come from unexpected places!")
  }

  // Add specific interest-based reasons
  if (match.interests.includes("DeFi") && answers[0] === 1) {
    reasons.push("You both love Monad's DeFi potential!")
  }
  if (match.interests.includes("Community") && answers[0] === 3) {
    reasons.push("Community builders unite!")
  }
  if (match.interests.includes("Memes") && answers[1] === 2) {
    reasons.push("Your meme game is on point together!")
  }

  // New question-specific reasons
  if (answers[3] === 0 && match.interests.includes("Smart Contracts")) {
    reasons.push("You both are passionate about building on Monad!")
  }
  if (answers[4] === 1 && match.interests.includes("Performance")) {
    reasons.push("Your shared excitement for parallel EVM is electric!")
  }
  if (answers[5] === 1 && match.interests.includes("Community")) {
    reasons.push("You both love staying connected with the Monad community!")
  }

  // Return a random reason or combine multiple
  if (reasons.length === 0) {
    return "You both believe in the future of Monad!"
  }
  
  return reasons[Math.floor(Math.random() * reasons.length)]
}

// Find best match from the pool
function findBestMatch(answers: number[]): Match {
  const userProfile = calculatePersonalityProfile(answers)
  
  // Calculate compatibility with all potential matches
  const matchesWithCompatibility = matchPool.map(match => {
    const compatibility = calculateCompatibility(userProfile, match.personality)
    const reason = generateCompatibilityReason(userProfile, match, compatibility, answers)
    
    return {
      username: match.username,
      compatibility,
      reason,
      avatar: match.avatar,
      interests: match.interests
    }
  })

  // Sort by compatibility and add some randomness to top matches
  matchesWithCompatibility.sort((a, b) => b.compatibility - a.compatibility)
  
  // Pick from top 3 matches to add variety
  const topMatches = matchesWithCompatibility.slice(0, 3)
  return topMatches[Math.floor(Math.random() * topMatches.length)]
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
      // Use real matching algorithm
      setTimeout(() => {
        const bestMatch = findBestMatch(newAnswers)
        setMatch(bestMatch)
        setGameState('result')
      }, 2000)
    }
  }

  const handleShare = () => {
    if (match) {
      const shareText = `I just found my MonCrush! ${match.compatibility}% compatibility with @${match.username} 💘 Find yours at MonCrush!`
      
      // In a real Farcaster app, this would use the Farcaster SDK
      if (navigator.share) {
        navigator.share({
          title: 'MonCrush Match!',
          text: shareText,
          url: window.location.href
        })
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText)
        alert('Match details copied to clipboard! Share on Farcaster!')
      }
    }
  }

  const handleMintNFT = () => {
    // This will be handled by the NFTMinting component
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
              <span>Answer 6 questions about Monad</span>
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
          <div>🔍 Analyzing your personality profile...</div>
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

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div className="text-2xl">💕</div>
            <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-2xl">
              {match.avatar}
            </div>
          </div>
          
          <div className="text-center">
            <div className="font-semibold text-lg mb-2">@{match.username}</div>
            <div className="text-sm opacity-75 italic mb-3">"{match.reason}"</div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {match.interests.map((interest, index) => (
                <span 
                  key={index}
                  className="bg-purple-500/30 text-purple-200 px-2 py-1 rounded-full text-xs"
                >
                  {interest}
                </span>
              ))}
            </div>
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
            <div className="space-y-2">
              <NFTMinting 
                match={match} 
                onSuccess={() => {
                  // Could add success handling here
                }}
              />
            </div>
            
            <div className="space-y-2">
              <MONTransfer 
                match={match} 
                onSuccess={(claimCode) => {
                  // Could add success handling here
                  console.log('MON sent with claim code:', claimCode)
                }}
              />
            </div>
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



