export async function GET() {
  const farcasterConfig = {
    accountAssociation: {
      header: "eyJmaWQiOjEwNTE4NTksInR5cGUiOiJhdXRoIiwia2V5IjoiMHg2NkY5MzA5OEI5ODc0MGY4MjhDZTgwOTk1ZTMwZDI0RGU1YzIwZGIzIn0",
      payload: "eyJkb21haW4iOiJtb25hZGNydXNoLnZlcmNlbC5hcHAifQ",
      signature: "3qTErx0eLxZAzhqMavbpuVDeaMnwrkW05O6Bvgw/1Ak7kjfYPUbHRa+R6psxmd81vTiPkMkn4sgweBAKsiFuYBw="
    },
    frame: {
      version: "1",
      name: "Monad Crush",
      iconUrl: `${APP_URL}/images/monad-crush-icon.png`,
      homeUrl: `${APP_URL}`,
      imageUrl: `${APP_URL}/images/monad-crush-feed.png`,
      screenshotUrls: [],
      tags: ["monad", "farcaster", "miniapp", "game", "crush"],
      primaryCategory: "games",
      buttonTitle: "Play Monad Crush",
      splashImageUrl: `${APP_URL}/images/monad-crush-splash.png`,
      splashBackgroundColor: "#ffffff",
      webhookUrl: `${APP_URL}/api/webhook`,
    },
  };

  return NextResponse.json(farcasterConfig);
}
