import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_URL || 'https://monadcrush.vercel.app'

  const farcasterConfig = {
    accountAssociation: {
      header: "eyJmaWQiOjEwNTE4NTksInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg2RjNDNzFmYzhDRGQxMTQ2OTIzMzQ2NTMyNTNhNDgxY0I5YjFlMDRmIn0",
      payload: "eyJkb21haW4iOiJtb25hZGNydXNoLnZlcmNlbC5hcHAifQ",
      signature: "MHg2NGM4NTlmYjk0Zjk2YjM5YmRmMjA3ZWE1NmQ3YTJkM2U3YjEzMDBlNGEzNjliMGUxZTU4MmZhZGI5NzEwN2FiMjIxNjY2NGQyNDkwZmQ3YmU2MjFlYTFhYWU0ZGQ4OWExMTQ3OTg3ODQyMDc0NGMyNjUxMTQ3NjE5OWNiM2UwZjFi"
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
      subtitle: "Find your onchain match.",
      description: "Monad Crush helps you find your perfect Monad match. Answer fun questions and connect with like-minded developers in the Monad ecosystem.",
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
      castShareUrl: `${appUrl}/share` // ✅ FIXED: Must match homeUrl domain
    }
  }

  return Response.json(farcasterConfig)
}
