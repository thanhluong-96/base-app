const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "eyJmaWQiOjE5NTkzNSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDQ1RTFCNjc2Njk0NDg4N0Y2NzlmN0Y3RTFlRTU4QmNhMjU5NEYwZDEifQ",
    payload: "eyJkb21haW4iOiJ2b3RpbmdiYXNlYXBwLnZlcmNlbC5hcHAifQ",
    signature: "UMwMPAiM1vXBcQLCmJ1U1VG7dtMNyKqzhJyNgz5Anbglqn6Vx5jKfpTeLHCF7MVSNRSWmMyhdTWSxm0lpBxhKxs="
  },
  miniapp: {
    version: "1",
    name: "Daily Poll", 
    subtitle: "Vote every day", 
    description: "Daily poll app - vote and share results with friends",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    splashImageUrl: `${ROOT_URL}/blue-hero.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["polls", "voting", "social", "daily"],
    heroImageUrl: `${ROOT_URL}/blue-hero.png`, 
    tagline: "Vote daily, share results",
    ogTitle: "Daily Poll - Vote Every Day",
    ogDescription: "Daily poll app - vote and share results with friends",
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
  },
} as const;

