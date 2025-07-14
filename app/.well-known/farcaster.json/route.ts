import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_URL || 'https://your-domain.vercel.app'
  
  const farcasterConfig = {
    // accountAssociation details are required to associated the published app with it's author
    accountAssociation: {
      "header": "",
      "payload": "",
      "signature": ""
    },
    frame: {
      version: "1",
      name: "MonCrush",
      iconUrl: `${appUrl}/images/icon.png`, // Icon of the app in the app store
      homeUrl: `${appUrl}`, // Default launch URL
      imageUrl: `${appUrl}/images/feed.png`, // Default image to show if shared in a feed.
      screenshotUrls: [], // Visual previews of the app
      tags: ["monad", "farcaster", "miniapp", "dating", "game", "crush"], // Descriptive tags for search
      primaryCategory: "games",
      buttonTitle: "Find Your MonCrush 💘",
      splashImageUrl: `${appUrl}/images/splash.png`, // URL of image to show on loading screen.
      splashBackgroundColor: "#6B46C1", // Hex color code to use on loading screen.
    }
  }

  return Response.json(farcasterConfig)
}

