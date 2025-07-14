import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
  const farcasterConfig = {
    accountAssociation: {
       
    },
    // TODO: Add account association
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


