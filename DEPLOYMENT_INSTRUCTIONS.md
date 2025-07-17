# MonadCrush Deployment Instructions

## Overview
This document provides step-by-step instructions to deploy and test the MonadCrush smart contracts and verify functionality.

## Prerequisites
- Node.js and npm installed
- Hardhat development environment
- Access to Monad Testnet
- Private key with MON tokens for testing

## Smart Contract Verification

### 1. Verify Existing Escrow Contract
The MonadCrushEscrow contract is already deployed at: `0x9EBbaB2aCc5641d2a0B2492865B6C300B134cd37`

To verify it's working:

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run verification script
npx hardhat run scripts/verify_contract.ts --network monadTestnet
```

### 2. Deploy NFT Contract
Deploy the new MonadCrushNFT contract:

```bash
# Deploy NFT contract
npx hardhat run scripts/deploy_nft.ts --network monadTestnet
```

After deployment, update the contract address in `lib/nft-contract.ts`:
```typescript
export const MONADCRUSH_NFT_CONTRACT = {
  address: 'YOUR_DEPLOYED_NFT_CONTRACT_ADDRESS', // Replace with actual address
  // ... rest of the configuration
}
```

## Configuration Updates

### 1. Update Hardhat Config
The `hardhat.config.ts` has been updated with your private key:
```typescript
accounts: ["ee0df329ba3bce81c1684044b795d6563a2d13849904ddf0f8b2c48f717fece3"]
```

### 2. Token Addresses
- MON Token: `0xa305f4B300930bE60A7C1C324841c90ea074d0BA`
- Escrow Contract: `0x9EBbaB2aCc5641d2a0B2492865B6C300B134cd37`

## Testing the Application

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Send/Claim Functionality

#### Sending MON:
1. Connect wallet to Monad Testnet
2. Find a match in the game
3. Click "Send MON" button
4. Select amount and enter recipient address
5. Confirm transaction
6. Copy the generated claim code

#### Claiming MON:
1. Go to "Claim MON from Your Crush" screen
2. Enter the 8-character claim code
3. Click "Check Claim Code"
4. If valid, click "Claim" to receive tokens

### 3. Test NFT Minting

#### Prerequisites:
- Deploy NFT contract first
- Update contract address in code

#### Minting Process:
1. Complete the matching game
2. Click "Mint Match Card" button
3. Confirm transaction (0.01 MON fee)
4. NFT will be minted with match metadata

## Smart Contract Functions

### MonadCrushEscrow Functions:
- `createClaim(bytes32 _claimCodeHash, uint256 _amount, address _recipient, string _message)` - Create a new claim
- `claimTokens(bytes32 _claimCodeHash)` - Claim tokens using code
- `getClaimInfo(bytes32 _claimCodeHash)` - Get claim details

### MonadCrushNFT Functions:
- `mint(address to, string tokenURI)` - Mint new NFT (0.01 MON)
- `mintPrice()` - Get current mint price
- `totalSupply()` - Get total minted NFTs

## Key Improvements Made

### 1. Send/Claim System
- ✅ Real smart contract integration
- ✅ Secure claim code generation (8-character alphanumeric)
- ✅ Proper token approval and transfer
- ✅ Claim validation and redemption
- ✅ User-friendly interface with address input

### 2. NFT Minting
- ✅ Complete ERC721 NFT contract
- ✅ Metadata generation with match details
- ✅ IPFS upload simulation (ready for real IPFS)
- ✅ Proper error handling and user feedback

### 3. Smart Contract Security
- ✅ OpenZeppelin contracts for security
- ✅ Proper access controls
- ✅ Event emission for transparency
- ✅ Reentrancy protection

## Troubleshooting

### Common Issues:

1. **Transaction Fails**: Check MON token balance and allowance
2. **Claim Code Invalid**: Ensure 8-character format (A-Z, 0-9)
3. **NFT Mint Fails**: Verify contract is deployed and address is updated
4. **Network Issues**: Confirm connection to Monad Testnet (Chain ID: 10143)

### Debug Commands:
```bash
# Check contract owner
npx hardhat console --network monadTestnet
> const contract = await ethers.getContractAt("MonadCrushEscrow", "0x9EBbaB2aCc5641d2a0B2492865B6C300B134cd37")
> await contract.owner()

# Check MON token balance
> const token = await ethers.getContractAt("IERC20", "0xa305f4B300930bE60A7C1C324841c90ea074d0BA")
> await token.balanceOf("YOUR_ADDRESS")
```

## Production Deployment

### For Production:
1. Deploy contracts to Monad Mainnet
2. Set up real IPFS service (Pinata/Infura)
3. Configure environment variables
4. Update contract addresses in frontend
5. Test thoroughly on testnet first

### Environment Variables:
```env
NEXT_PUBLIC_MONAD_RPC_URL=https://rpc.monad.xyz
NEXT_PUBLIC_ESCROW_CONTRACT=0x...
NEXT_PUBLIC_NFT_CONTRACT=0x...
NEXT_PUBLIC_MON_TOKEN=0x...
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret
```

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all contract addresses are correct
3. Ensure sufficient MON balance for transactions
4. Confirm network connection to Monad Testnet

The smart contracts are now properly integrated and ready for testing!

