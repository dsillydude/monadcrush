import App from '../components/pages/app'
import { APP_URL } from '../lib/constants'
import type { Metadata } from 'next'

const frame = {
  version: 'next',
  imageUrl: `${APP_URL}/images/feed.png`,
  button: {
    title: 'Find Your MonCrush 💘',
    action: {
      type: 'launch_frame',
      name: 'MonCrush',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: '#6B46C1',
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'MonCrush - Find Your Perfect Monad Match',
    openGraph: {
      title: 'MonCrush - Find Your Perfect Monad Match',
      description: 'Find your perfect match through code, vibes, and a little onchain fate.',
    },
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  }
}

export default function Home() {
  return <App />
}

