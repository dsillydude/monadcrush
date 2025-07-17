
import { ethers } from "hardhat";
import { MonadCrushEscrow, MockMonToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

async function main() {
  const [deployer, recipient]: SignerWithAddress[] = await ethers.getSigners();

  // Deploy the MonadCrushEscrow contract
  const MonadCrushEscrowFactory = await ethers.getContractFactory("MonadCrushEscrow");
  // Assuming a mock MON token for local testing
  const MockMonTokenFactory = await ethers.getContractFactory("MockMonToken");
  const mockMonToken: MockMonToken = await MockMonTokenFactory.deploy();
  await mockMonToken.waitForDeployment();

  const monadCrushEscrow: MonadCrushEscrow = await MonadCrushEscrowFactory.deploy(await mockMonToken.getAddress());
  await monadCrushEscrow.waitForDeployment();

  console.log("MonadCrushEscrow deployed to:", await monadCrushEscrow.getAddress());
  console.log("MockMonToken deployed to:", await mockMonToken.getAddress());

  // Mint some mock MON tokens for the deployer
  await mockMonToken.mint(deployer.address, ethers.parseEther("1000"));
  console.log("Deployer has 1000 Mock MON tokens.");

  // Approve the escrow contract to spend deployer's tokens
  await mockMonToken.approve(await monadCrushEscrow.getAddress(), ethers.parseEther("100"));
  console.log("Approved MonadCrushEscrow to spend 100 Mock MON tokens.");

  // Test createClaim function
  const claimCode: string = ethers.keccak256(ethers.toUtf8Bytes("mysecretcode123"));
  const amountToSend = ethers.parseEther("10");
  const message: string = "For your amazing work!";

  await monadCrushEscrow.connect(deployer).createClaim(claimCode, amountToSend, recipient.address, message);
  console.log("Claim created successfully.");

  // Test getClaimInfo
  let claimInfo = await monadCrushEscrow.getClaimInfo(claimCode);
  console.log("Claim Info (before claim):");
  console.log("  Amount:", ethers.formatEther(claimInfo.amount));
  console.log("  Recipient:", claimInfo.recipient);
  console.log("  Claimed:", claimInfo.claimed);
  console.log("  Message:", claimInfo.message);
  console.log("  Sender:", claimInfo.sender);

  // Test claimTokens function
  await monadCrushEscrow.connect(recipient).claimTokens(claimCode);
  console.log("Tokens claimed successfully by recipient.");

  // Verify recipient balance
  const recipientBalance = await mockMonToken.balanceOf(recipient.address);
  console.log("Recipient Mock MON balance:", ethers.formatEther(recipientBalance));

  // Test getClaimInfo after claim
  claimInfo = await monadCrushEscrow.getClaimInfo(claimCode);
  console.log("Claim Info (after claim):");
  console.log("  Claimed:", claimInfo.claimed);
}

main().catch((error: Error) => {
  console.error(error);
  process.exitCode = 1;
});


