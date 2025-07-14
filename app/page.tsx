import App from '@/components/pages/app'
import { APP_URL } from '@/lib/constants'
import type { Metadata } from 'next'

const frame = {
  version: 'next',
  imageUrl: `${APP_URL}/images/monad-crush-feed.png`,
  button: {
    title: 'Play Monad Crush',
    action: {
      type: 'launch_frame',
      name: 'Monad Crush',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/images/monad-crush-splash.png`,
      splashBackgroundColor: '#f7f7f7',
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Monad Crush',
    openGraph: {
      title: 'Monad Crush',
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


