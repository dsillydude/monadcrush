import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

  // Deploy MockMonToken (for testing purposes)
  const MockMonTokenFactory = await ethers.getContractFactory("MockMonToken");
  const mockMonToken = await MockMonTokenFactory.deploy();
  await mockMonToken.waitForDeployment();
  console.log("MockMonToken deployed to:", await mockMonToken.getAddress());

  // Deploy MonadCrushEscrow
  const MonadCrushEscrowFactory = await ethers.getContractFactory("MonadCrushEscrow");
  const monadCrushEscrow = await MonadCrushEscrowFactory.deploy(await mockMonToken.getAddress());
  await monadCrushEscrow.waitForDeployment();
  console.log("MonadCrushEscrow deployed to:", await monadCrushEscrow.getAddress());

  // Deploy MonadCrushNFT with mint price of 0.01 MON
  const mintPrice = ethers.parseEther("0.01");
  const MonadCrushNFTFactory = await ethers.getContractFactory("MonadCrushNFT");
  const monadCrushNFT = await MonadCrushNFTFactory.deploy(await mockMonToken.getAddress(), mintPrice);
  await monadCrushNFT.waitForDeployment();
  console.log("MonadCrushNFT deployed to:", await monadCrushNFT.getAddress());

  // Mint some tokens for testing
  await mockMonToken.mint(deployer.address, ethers.parseEther("1000"));
  console.log("Minted 1000 MockMonTokens for deployer");

  console.log("\nDeployment Summary:");
  console.log("==================");
  console.log("MockMonToken:", await mockMonToken.getAddress());
  console.log("MonadCrushEscrow:", await monadCrushEscrow.getAddress());
  console.log("MonadCrushNFT:", await monadCrushNFT.getAddress());
  console.log("NFT Mint Price:", ethers.formatEther(mintPrice), "MON");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

