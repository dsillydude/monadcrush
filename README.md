# MonCrush - Farcaster Miniapp

MonCrush is a Farcaster miniapp that gamifies romantic connections within the Monad ecosystem. Users answer three personality questions about their relationship with Monad, get matched with compatible users, and can mint NFTs or send MON tokens to their matches.

## Features

- **Three-Question Personality Assessment**: Users answer questions about their relationship with Monad
- **AI-Powered Matching**: Compatibility scoring based on responses
- **Social Sharing**: Built-in Farcaster integration for viral growth
- **NFT Minting**: Mint match cards as NFTs for 0.01 MON
- **Token Transfers**: Send MON tokens to matches with claim codes
- **Beautiful UI**: Purple-pink gradient theme with smooth animations

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Farcaster Integration**: @farcaster/frame-sdk
- **Blockchain**: Monad Testnet integration
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd moncrush-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local`:
```
NEXT_PUBLIC_URL=https://your-domain.vercel.app
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Building for Production

Build the application:
```bash
npm run build
```

This creates an optimized production build with static export enabled.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set the environment variable `NEXT_PUBLIC_URL` to your Vercel domain
4. Deploy

### Manual Deployment

The app is configured for static export and can be deployed to any static hosting service:

```bash
npm run build
# Deploy the 'out' directory to your hosting service
```

## Farcaster Integration

### Configuration

Update the Farcaster configuration in `app/.well-known/farcaster.json/route.ts`:

1. Set your production URL
2. Add account association details (required for app store)
3. Update app metadata (name, description, tags)

### Testing in Farcaster

1. Deploy your app to a public URL
2. Open the URL in the Farcaster app
3. The app will automatically detect the Farcaster environment

## Monad Integration

### Current Features

- Monad Testnet support (Chain ID: 10143)
- MON token integration for payments
- NFT minting capabilities

### Future Enhancements

- Smart contract deployment for match NFTs
- Escrow system for MON transfers
- Claim code system for token transfers
- Advanced matching algorithms

## Game Flow

1. **Intro Screen**: Welcome message and game explanation
2. **Question 1**: "What's one thing you LOVE about Monad?"
3. **Question 2**: "What's your ideal Monad date?"
4. **Question 3**: "If Monad were a person, they would be..."
5. **Matching**: AI-powered compatibility analysis
6. **Results**: Match reveal with compatibility score
7. **Actions**: Share, mint NFT, or send MON tokens

## Customization

### Questions

Update the questions in `components/pages/app.tsx`:

```typescript
const questions: Question[] = [
  {
    id: 1,
    text: "Your custom question",
    placeholder: "Placeholder text..."
  },
  // Add more questions
]
```

### Styling

The app uses Tailwind CSS. Main color scheme:
- Primary Purple: `#6B46C1`
- Love Pink: `#EC4899`
- Background gradient: `from-purple-900 to-pink-900`

### Matching Algorithm

Currently uses a simple mock algorithm. Implement your own in the `handleAnswerSubmit` function:

```typescript
// Replace with your matching logic
const mockMatch: Match = {
  username: 'matched_user',
  compatibility: calculateCompatibility(answers),
  reason: generateMatchReason(answers)
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or support:
- Create an issue on GitHub
- Join the Monad Discord community
- Follow @monad on Farcaster

## Roadmap

- [ ] Real user matching system
- [ ] Advanced compatibility algorithms
- [ ] Smart contract integration
- [ ] Leaderboards and achievements
- [ ] Daily streak system
- [ ] Premium features
- [ ] Multi-language support

---

Built with ❤️ for the Monad and Farcaster communities

