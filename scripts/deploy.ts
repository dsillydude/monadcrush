import { ethers } from "hardhat";

async function main() {
  const monTokenAddress = "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701"; // WrappedMonad token address on Monad Testnet

  const MonadCrushEscrow = await ethers.getContractFactory("MonadCrushEscrow");
  const monadCrushEscrow = await MonadCrushEscrow.deploy(monTokenAddress);

  await monadCrushEscrow.waitForDeployment();

  console.log(
    `MonadCrushEscrow deployed to ${monadCrushEscrow.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


