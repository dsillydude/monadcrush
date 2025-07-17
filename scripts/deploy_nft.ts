import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying MonadCrushNFT with the account:", deployer.address);

  const MonadCrushNFT = await ethers.getContractFactory("MonadCrushNFT");
  const monadCrushNFT = await MonadCrushNFT.deploy();

  await monadCrushNFT.deployed();

  console.log("MonadCrushNFT deployed to:", monadCrushNFT.address);
  
  // Verify the deployment
  console.log("Verifying deployment...");
  const mintPrice = await monadCrushNFT.mintPrice();
  console.log("Mint price:", ethers.utils.formatEther(mintPrice), "MON");
  
  const totalSupply = await monadCrushNFT.totalSupply();
  console.log("Total supply:", totalSupply.toString());
  
  console.log("\nDeployment Summary:");
  console.log("==================");
  console.log("Contract Address:", monadCrushNFT.address);
  console.log("Deployer:", deployer.address);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Mint Price:", ethers.utils.formatEther(mintPrice), "MON");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

