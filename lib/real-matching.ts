// Real-world matching service that integrates with the backend
import { useState, useEffect } from 'react'

export interface RealUser {
  id: number
  farcaster_fid?: number
  farcaster_username?: string
  twitter_username?: string
  display_name: string
  bio: string
  avatar_url: string
  follower_count: number
  following_count: number
  personality: {
    technical: number
    community: number
    innovation: number
    humor: number
  }
  activity: {
    total_posts: number
    monad_posts: number
    avg_engagement: number
    last_post_date?: string
  }
  interests: string[]
  top_keywords: string[]
  is_active: boolean
  looking_for_matches: boolean
  compatibility?: number
  compatibility_reason?: string
}

export interface UserPost {
  id: number
  platform: string
  text_content: string
  engagement: {
    likes: number
    replies: number
    reposts: number
  }
  analysis: {
    is_monad_related: boolean
    sentiment_score: number
    technical_keywords: string[]
  }
  posted_at: string
}

class RealMatchingService {
  private baseUrl: string
  
  constructor(baseUrl: string = 'http://localhost:5000/api/monad') {
    this.baseUrl = baseUrl
  }

  async searchUsers(params: {
    platform?: 'farcaster' | 'twitter'
    min_posts?: number
    active_since?: string
    looking_for_matches?: boolean
    limit?: number
  } = {}): Promise<RealUser[]> {
    const queryParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })

    try {
      const response = await fetch(`${this.baseUrl}/users/search?${queryParams}`)
      const data = await response.json()
      
      if (data.success) {
        return data.users
      } else {
        throw new Error(data.error || 'Failed to search users')
      }
    } catch (error) {
      console.error('Error searching users:', error)
      throw error
    }
  }

  async getUserMatches(userId: number): Promise<RealUser[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/matches`)
      const data = await response.json()
      
      if (data.success) {
        return data.matches
      } else {
        throw new Error(data.error || 'Failed to get matches')
      }
    } catch (error) {
      console.error('Error getting user matches:', error)
      throw error
    }
  }

  async collectUserData(platform: 'farcaster' | 'twitter', identifier: string): Promise<{
    user: RealUser
    analysis: any
    posts_collected: number
    monad_posts: number
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/users/collect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platform,
          identifier
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        return data
      } else {
        throw new Error(data.error || 'Failed to collect user data')
      }
    } catch (error) {
      console.error('Error collecting user data:', error)
      throw error
    }
  }

  async getRecentPosts(platform?: 'farcaster' | 'twitter', limit: number = 50): Promise<UserPost[]> {
    const queryParams = new URLSearchParams()
    queryParams.append('limit', limit.toString())
    
    if (platform) {
      queryParams.append('platform', platform)
    }

    try {
      const response = await fetch(`${this.baseUrl}/posts/recent?${queryParams}`)
      const data = await response.json()
      
      if (data.success) {
        return data.posts
      } else {
        throw new Error(data.error || 'Failed to get recent posts')
      }
    } catch (error) {
      console.error('Error getting recent posts:', error)
      throw error
    }
  }

  async getCommunityAnalytics(): Promise<{
    total_users: number
    active_users: number
    platform_distribution: {
      farcaster: number
      twitter: number
    }
    personality_averages: {
      technical: number
      community: number
      innovation: number
      humor: number
    }
    recent_activity: {
      posts_last_week: number
    }
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/community`)
      const data = await response.json()
      
      if (data.success) {
        return data.stats
      } else {
        throw new Error(data.error || 'Failed to get community analytics')
      }
    } catch (error) {
      console.error('Error getting community analytics:', error)
      throw error
    }
  }

  // Convert real user to the format expected by the existing UI
  convertToUIFormat(realUser: RealUser): any {
    return {
      username: realUser.farcaster_username || realUser.twitter_username || 'unknown',
      compatibility: realUser.compatibility || 85,
      reason: realUser.compatibility_reason || 'Strong alignment in technical expertise',
      avatar: realUser.avatar_url || '/images/monad-crush-icon.png',
      interests: realUser.interests.length > 0 ? realUser.interests : ['DeFi', 'Development', 'Community'],
      bio: realUser.bio || 'Monad enthusiast and blockchain developer',
      stats: {
        posts: realUser.activity.total_posts,
        monad_posts: realUser.activity.monad_posts,
        followers: realUser.follower_count,
        engagement: Math.round(realUser.activity.avg_engagement)
      },
      personality: realUser.personality,
      platform: realUser.farcaster_fid ? 'farcaster' : 'twitter',
      platform_id: realUser.farcaster_fid || realUser.twitter_username
    }
  }

  // Generate a realistic match based on user's answers (fallback for when no real users available)
  generateFallbackMatch(answers: number[]): any {
    const fallbackUsers = [
      {
        username: 'monad_dev',
        compatibility: 92,
        reason: 'Exceptional technical alignment and shared innovation mindset',
        avatar: '/images/monad-crush-icon.png',
        interests: ['Development', 'DeFi', 'Infrastructure'],
        bio: 'Core contributor to Monad protocol. Building the future of blockchain scalability.',
        stats: { posts: 156, monad_posts: 89, followers: 2340, engagement: 45 },
        personality: { technical: 95, community: 78, innovation: 88, humor: 65 },
        platform: 'farcaster',
        platform_id: '12345'
      },
      {
        username: 'monad_community',
        compatibility: 88,
        reason: 'Strong community focus and excellent collaboration skills',
        avatar: '/images/monad-crush-icon.png',
        interests: ['Community', 'Governance', 'Education'],
        bio: 'Community manager and educator. Helping newcomers navigate the Monad ecosystem.',
        stats: { posts: 234, monad_posts: 145, followers: 1890, engagement: 67 },
        personality: { technical: 65, community: 92, innovation: 75, humor: 80 },
        platform: 'twitter',
        platform_id: 'monad_community'
      },
      {
        username: 'monad_innovator',
        compatibility: 85,
        reason: 'Shared vision for blockchain innovation and future technologies',
        avatar: '/images/monad-crush-icon.png',
        interests: ['Innovation', 'Research', 'Scalability'],
        bio: 'Researcher and innovator exploring next-gen blockchain solutions.',
        stats: { posts: 98, monad_posts: 67, followers: 3456, engagement: 78 },
        personality: { technical: 82, community: 70, innovation: 95, humor: 58 },
        platform: 'farcaster',
        platform_id: '67890'
      }
    ]

    // Simple algorithm to pick based on answers
    const personalityScores = this.calculatePersonalityFromAnswers(answers)
    
    // Find best match based on personality alignment
    let bestMatch = fallbackUsers[0]
    let bestScore = 0
    
    for (const user of fallbackUsers) {
      const score = this.calculateCompatibilityScore(personalityScores, user.personality)
      if (score > bestScore) {
        bestScore = score
        bestMatch = user
      }
    }
    
    return {
      ...bestMatch,
      compatibility: Math.round(bestScore)
    }
  }

  private calculatePersonalityFromAnswers(answers: number[]): any {
    // Convert answers to personality scores (simplified version)
    const technical = (answers[0] || 0) * 20 + (answers[3] || 0) * 15 + (answers[5] || 0) * 10
    const community = (answers[1] || 0) * 25 + (answers[4] || 0) * 15 + (answers[2] || 0) * 10
    const innovation = (answers[2] || 0) * 20 + (answers[5] || 0) * 20 + (answers[0] || 0) * 10
    const humor = (answers[1] || 0) * 15 + (answers[4] || 0) * 20 + (answers[3] || 0) * 15
    
    return {
      technical: Math.min(100, technical),
      community: Math.min(100, community),
      innovation: Math.min(100, innovation),
      humor: Math.min(100, humor)
    }
  }

  private calculateCompatibilityScore(personality1: any, personality2: any): number {
    const weights = { technical: 0.3, community: 0.25, innovation: 0.25, humor: 0.2 }
    let score = 0
    
    for (const [trait, weight] of Object.entries(weights)) {
      const similarity = 100 - Math.abs(personality1[trait] - personality2[trait])
      score += similarity * weight
    }
    
    return score
  }
}

// React hook for using the real matching service
export function useRealMatching() {
  const [service] = useState(() => new RealMatchingService())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchUsers = async (params: any = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const users = await service.searchUsers(params)
      return users
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const getMatches = async (userId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const matches = await service.getUserMatches(userId)
      return matches.map(user => service.convertToUIFormat(user))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const collectUserData = async (platform: 'farcaster' | 'twitter', identifier: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await service.collectUserData(platform, identifier)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const findRealMatch = async (answers: number[]) => {
    setIsLoading(true)
    setError(null)
    try {
      // Try to get real users first
      const users = await service.searchUsers({ 
        looking_for_matches: true, 
        min_posts: 5,
        limit: 20 
      })
      
      if (users.length > 0) {
        // Calculate compatibility with each user based on answers
        const personalityScores = service['calculatePersonalityFromAnswers'](answers)
        
        const usersWithCompatibility = users.map(user => ({
          ...user,
          compatibility: service['calculateCompatibilityScore'](personalityScores, user.personality)
        }))
        
        // Sort by compatibility and pick the best match
        usersWithCompatibility.sort((a, b) => b.compatibility - a.compatibility)
        const bestMatch = usersWithCompatibility[0]
        
        return service.convertToUIFormat(bestMatch)
      } else {
        // Fallback to generated match
        return service.generateFallbackMatch(answers)
      }
    } catch (err) {
      console.warn('Real matching failed, using fallback:', err)
      // Always provide a fallback match
      return service.generateFallbackMatch(answers)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    searchUsers,
    getMatches,
    collectUserData,
    findRealMatch,
    isLoading,
    error,
    service
  }
}

export default RealMatchingService

