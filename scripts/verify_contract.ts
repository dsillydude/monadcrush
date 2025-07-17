import { ethers } from "hardhat";
import { Signer } from "ethers";
import { MonadCrushEscrow, IERC20 } from "../typechain-types";

async function main() {
  const [deployer]: Signer[] = await ethers.getSigners();
  console.log("Using account:", await deployer.getAddress());

  const monTokenAddress = "0xa305f4B300930bE60A7C1C324841c90ea074d0BA"; // Provided MON token address
  const MonadCrushEscrowFactory = await ethers.getContractFactory("MonadCrushEscrow");
  const monadCrushEscrow: MonadCrushEscrow = MonadCrushEscrowFactory.attach("0x9EBbaB2aCc5641d2a0B2492865B6C300B134cd37") as MonadCrushEscrow; // Provided contract address

  console.log("MonadCrushEscrow attached to:", monadCrushEscrow.address);

  // Test createClaim function
  const claimCode = ethers.encodeBytes32String("test_claim_code"); // Corrected for ethers v6
  const amount = ethers.parseUnits("1", 18); // Corrected for ethers v6
  const recipient = await deployer.getAddress(); // Sending to self for testing
  const message = "Test claim";

  console.log("\n--- Testing createClaim ---");
  try {
    // Approve the escrow contract to spend MON tokens
    const MonTokenFactory = await ethers.getContractFactory("IERC20");
    const monToken: IERC20 = MonTokenFactory.attach(monTokenAddress) as IERC20;
    const approveTx = await monToken.connect(deployer).approve(monadCrushEscrow.address, amount);
    await approveTx.wait();
    console.log("Approved MonadCrushEscrow to spend MON tokens.");

    const createClaimTx = await monadCrushEscrow.connect(deployer).createClaim(claimCode, amount, recipient, message);
    await createClaimTx.wait();
    console.log("createClaim successful. Tx Hash:", createClaimTx.hash);
  } catch (error: any) {
    console.error("createClaim failed:", error.message);
  }

  // Test getClaimInfo function
  console.log("\n--- Testing getClaimInfo ---");
  try {
    const claimInfo = await monadCrushEscrow.getClaimInfo(claimCode);
    console.log("Claim Info:", {
      amount: ethers.formatUnits(claimInfo.amount, 18), // Corrected for ethers v6
      recipient: claimInfo.recipient,
      claimed: claimInfo.claimed,
      message: claimInfo.message,
      sender: claimInfo.sender,
    });
  } catch (error: any) {
    console.error("getClaimInfo failed:", error.message);
  }

  // Test claimTokens function
  console.log("\n--- Testing claimTokens ---");
  try {
    const claimTokensTx = await monadCrushEscrow.connect(deployer).claimTokens(claimCode);
    await claimTokensTx.wait();
    console.log("claimTokens successful. Tx Hash:", claimTokensTx.hash);
  } catch (error: any) {
    console.error("claimTokens failed:", error.message);
  }

  // Verify claim status after claiming
  console.log("\n--- Verifying claim status after claiming ---");
  try {
    const claimInfoAfterClaim = await monadCrushEscrow.getClaimInfo(claimCode);
    console.log("Claim Info after claiming:", {
      amount: ethers.formatUnits(claimInfoAfterClaim.amount, 18), // Corrected for ethers v6
      recipient: claimInfoAfterClaim.recipient,
      claimed: claimInfoAfterClaim.claimed,
      message: claimInfoAfterClaim.message,
      sender: claimInfoAfterClaim.sender,
    });
  } catch (error: any) {
    console.error("Verification after claiming failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error(error);
    process.exit(1);
  });
