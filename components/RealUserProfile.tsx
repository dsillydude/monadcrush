'use client'

import { useState } from 'react'
import { RealUser } from '@/lib/real-matching'

interface RealUserProfileProps {
  user: RealUser | any // Support both real and fallback users
  onClose: () => void
}

export function RealUserProfile({ user, onClose }: RealUserProfileProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'posts'>('profile')

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'farcaster':
        return '🟣'
      case 'twitter':
        return '🐦'
      default:
        return '👤'
    }
  }

  const getPlatformUrl = (platform: string, identifier: string | number) => {
    switch (platform) {
      case 'farcaster':
        return `https://warpcast.com/${user.username}`
      case 'twitter':
        return `https://twitter.com/${identifier}`
      default:
        return '#'
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getPersonalityColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getPersonalityWidth = (score: number) => {
    return `${Math.max(5, score)}%`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 border-b">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
          
          <div className="flex items-start space-x-4">
            <img
              src={user.avatar || '/images/monad-crush-icon.png'}
              alt={user.display_name || user.username}
              className="w-20 h-20 rounded-full object-cover"
            />
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.display_name || user.username}
                </h2>
                <span className="text-lg">
                  {getPlatformIcon(user.platform)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-gray-600">@{user.username}</span>
                <a
                  href={getPlatformUrl(user.platform, user.platform_id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 text-sm"
                >
                  View Profile →
                </a>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{formatNumber(user.follower_count || user.stats?.followers || 0)} followers</span>
                <span>{formatNumber(user.following_count || 0)} following</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {user.compatibility || 85}% match
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {['profile', 'activity', 'posts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 px-4 text-center capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-purple-600 text-purple-600 font-medium'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Bio */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-700 leading-relaxed">
                  {user.bio || 'Monad enthusiast and blockchain developer passionate about the future of decentralized technology.'}
                </p>
              </div>

              {/* Compatibility Reason */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Why You Match</h3>
                <p className="text-gray-700 bg-purple-50 p-3 rounded-lg">
                  {user.compatibility_reason || user.reason || 'Strong alignment in technical expertise and shared passion for Monad ecosystem.'}
                </p>
              </div>

              {/* Interests */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {(user.interests || ['DeFi', 'Development', 'Community']).map((interest: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Personality Scores */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Personality Profile</h3>
                <div className="space-y-3">
                  {Object.entries(user.personality || { technical: 75, community: 80, innovation: 70, humor: 65 }).map(([trait, score]) => (
                    <div key={trait}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="capitalize text-gray-700">{trait}</span>
                        <span className={`font-medium ${getPersonalityColor(score as number)}`}>
                          {score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: getPersonalityWidth(score as number) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              {/* Activity Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {user.activity?.total_posts || user.stats?.posts || 0}
                  </div>
                  <div className="text-gray-600 text-sm">Total Posts</div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {user.activity?.monad_posts || user.stats?.monad_posts || 0}
                  </div>
                  <div className="text-gray-600 text-sm">Monad Posts</div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(user.activity?.avg_engagement || user.stats?.engagement || 0)}
                  </div>
                  <div className="text-gray-600 text-sm">Avg Engagement</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {user.is_active !== false ? 'Active' : 'Inactive'}
                  </div>
                  <div className="text-gray-600 text-sm">Status</div>
                </div>
              </div>

              {/* Top Keywords */}
              {user.top_keywords && user.top_keywords.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Top Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.top_keywords.map((keyword: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Last Activity */}
              {user.activity?.last_post_date && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Last Activity</h3>
                  <p className="text-gray-600">
                    {new Date(user.activity.last_post_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📝</div>
                <p>Recent posts will be displayed here</p>
                <p className="text-sm mt-1">Connect to {user.platform} to view latest activity</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Send Message
            </button>
            <button
              onClick={() => window.open(getPlatformUrl(user.platform, user.platform_id), '_blank')}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              View on {user.platform === 'farcaster' ? 'Warpcast' : 'Twitter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

