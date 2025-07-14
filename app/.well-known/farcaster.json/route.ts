import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_URL || 'https://monadcrush.vercel.app'

  const farcasterConfig = {
    accountAssociation: {
      header: "eyJmaWQiOjEwNTE4NTksInR5cGUiOiJhdXRoIiwia2V5IjoiMHg2NkY5MzA5OEI5ODc0MGY4MjhDZTgwOTk1ZTMwZDI0RGU1YzIwZGIzIn0",
      payload: "eyJkb21haW4iOiJtb25hZGNydXNoLnZlcmNlbC5hcHAifQ",
      signature: "3qTErx0eLxZAzhqMavbpuVDeaMnwrkW05O6Bvgw/1Ak7kjfYPUbHRa+R6psxmd81vTiPkMkn4sgweBAKsiFuYBw="
    },
    frame: {
      name: "Monad Crush",
      version: "1",
      iconUrl: `${appUrl}/images/monad-crush-icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/images/monad-crush-feed.png`,
      buttonTitle: "Play Monad Crush",
      splashImageUrl: `${appUrl}/images/monad-crush-splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
      subtitle: "Find your perfect match through code, vibes, and a little onchain fate.",
      description: "Monad Crush is a unique Farcaster Mini App that helps you find your Monad soulmate. Answer fun questions about your Monad preferences and discover your perfect match in the Monad ecosystem. Engage with on-chain actions and connect with like-minded Monad community members.",
      primaryCategory: "games",
      screenshotUrls: [
        `${appUrl}/images/screenshot1.png`
      ],
      tags: [
        "game",
        "monad",
        "crush",
        "puzzle",
        "web3"
      ],
      tagline: "Find your soulmate onchain!",
      ogTitle: "Find Your Onchain Soulmate",
      ogDescription: "Discover your perfect match in the Monad ecosystem with this fun Farcaster Mini App.",
      ogImageUrl: `${appUrl}/images/monad-crush-og.png`,
      castShareUrl: `https://warpcast.com/~compose?text=Check%20out%20Monad%20Crush%20on%20Farcaster!%20Find%20your%20onchain%20soulmate!%20${appUrl}`
    }
  }

  return Response.json(farcasterConfig)
}
