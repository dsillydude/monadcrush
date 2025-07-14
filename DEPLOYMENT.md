# MonCrush Deployment Guide

## Quick Deployment with Vercel

### 1. Prepare Your Repository

1. Push your MonCrush code to GitHub:
```bash
git init
git add .
git commit -m "Initial MonCrush commit"
git branch -M main
git remote add origin https://github.com/yourusername/moncrush.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your MonCrush repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `out` (important!)

### 3. Environment Variables

In Vercel dashboard, add these environment variables:

```
NEXT_PUBLIC_URL=https://your-app-name.vercel.app
```

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Farcaster App Store Submission

### 1. Update Farcaster Configuration

In `app/.well-known/farcaster.json/route.ts`, update:

```typescript
const appUrl = process.env.NEXT_PUBLIC_URL || 'https://your-actual-domain.vercel.app'
```

### 2. Account Association (Required)

To submit to the Farcaster app store, you need to associate your app with your Farcaster account:

1. Generate account association using Farcaster tools
2. Update the `accountAssociation` object in the farcaster.json route
3. Redeploy your app

### 3. App Store Assets

Ensure you have these assets in your `public/images/` directory:
- `icon.png` - App icon (512x512px recommended)
- `feed.png` - Feed preview image (1200x630px)
- `splash.png` - Loading screen image (1200x630px)

### 4. Submit to App Store

1. Visit the Farcaster developer portal
2. Submit your app URL
3. Wait for review and approval

## Custom Domain (Optional)

### 1. Add Domain to Vercel

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain

### 2. Update Environment Variables

Update `NEXT_PUBLIC_URL` to your custom domain:
```
NEXT_PUBLIC_URL=https://moncrush.yourdomain.com
```

### 3. Redeploy

Trigger a new deployment to update the configuration.

## Testing Your Deployment

### 1. Basic Functionality

1. Visit your deployed URL
2. Test the complete game flow
3. Verify all buttons and interactions work

### 2. Farcaster Integration

1. Open your app URL in the Farcaster mobile app
2. Test the miniapp functionality
3. Verify sharing features work

### 3. Frame Validation

Test your Farcaster frame at:
- [Farcaster Frame Validator](https://warpcast.com/~/developers/frames)

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Check that all dependencies are installed
2. Verify TypeScript types are correct
3. Ensure environment variables are set

### Farcaster Integration Issues

1. Verify your farcaster.json is accessible at `/.well-known/farcaster.json`
2. Check that your app URL is correct
3. Ensure account association is properly configured

### Performance Issues

1. Optimize images in the `public/images/` directory
2. Check bundle size with `npm run build`
3. Consider implementing lazy loading for heavy components

## Monitoring and Analytics

### 1. Vercel Analytics

Enable Vercel Analytics in your dashboard for basic metrics.

### 2. Custom Analytics

Add your preferred analytics service:

```typescript
// In your app component
useEffect(() => {
  // Initialize your analytics
  analytics.track('app_loaded')
}, [])
```

### 3. Error Monitoring

Consider adding error monitoring:

```bash
npm install @sentry/nextjs
```

## Scaling Considerations

### 1. Database Integration

For real user matching, consider adding:
- PostgreSQL for user data
- Redis for caching
- Vector database for similarity matching

### 2. Blockchain Integration

For production Monad integration:
- Deploy smart contracts
- Implement wallet connections
- Add transaction monitoring

### 3. Performance Optimization

- Implement caching strategies
- Optimize images and assets
- Consider CDN for global distribution

## Security Checklist

- [ ] Environment variables are secure
- [ ] No sensitive data in client-side code
- [ ] HTTPS is enforced
- [ ] Input validation is implemented
- [ ] Rate limiting is considered

## Support

If you encounter issues during deployment:

1. Check Vercel deployment logs
2. Review browser console for errors
3. Test in Farcaster app environment
4. Consult Farcaster developer documentation

---

Happy deploying! 🚀

