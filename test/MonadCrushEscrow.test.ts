
import { expect } from "chai";
import { ethers } from "hardhat";
import { MonadCrushEscrow, MockMonToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("MonadCrushEscrow", function () {
  let monadCrushEscrow: MonadCrushEscrow;
  let mockMonToken: MockMonToken;
  let deployer: SignerWithAddress;
  let recipient: SignerWithAddress;
  let otherUser: SignerWithAddress;

  beforeEach(async function () {
    [deployer, recipient, otherUser] = await ethers.getSigners();

    const MockMonTokenFactory = await ethers.getContractFactory("MockMonToken");
    mockMonToken = (await MockMonTokenFactory.deploy()) as MockMonToken;
    await mockMonToken.waitForDeployment();

    const MonadCrushEscrowFactory = await ethers.getContractFactory("MonadCrushEscrow");
    monadCrushEscrow = (await MonadCrushEscrowFactory.deploy(await mockMonToken.getAddress())) as MonadCrushEscrow;
    await monadCrushEscrow.waitForDeployment();

    // Mint some mock MON tokens for the deployer
    await mockMonToken.mint(deployer.address, ethers.parseEther("1000"));
  });

  describe("createClaim", function () {
    it("should create a claim and transfer tokens to the escrow contract", async function () {
      const claimCode: string = ethers.keccak256(ethers.toUtf8Bytes("testcode1"));
      const amountToSend = ethers.parseEther("10");
      const message: string = "Test message";

      await mockMonToken.connect(deployer).approve(await monadCrushEscrow.getAddress(), amountToSend);

      await expect(monadCrushEscrow.connect(deployer).createClaim(claimCode, amountToSend, recipient.address, message))
        .to.emit(monadCrushEscrow, "ClaimCreated")
        .withArgs(claimCode, amountToSend, recipient.address, deployer.address);

      const escrowBalance = await mockMonToken.balanceOf(await monadCrushEscrow.getAddress());
      expect(escrowBalance).to.equal(amountToSend);

      const claimInfo = await monadCrushEscrow.getClaimInfo(claimCode);
      expect(claimInfo.amount).to.equal(amountToSend);
      expect(claimInfo.recipient).to.equal(recipient.address);
      expect(claimInfo.claimed).to.be.false;
      expect(claimInfo.message).to.equal(message);
      expect(claimInfo.sender).to.equal(deployer.address);
    });

    it("should not allow creating a claim with an existing claim code", async function () {
      const claimCode: string = ethers.keccak256(ethers.toUtf8Bytes("testcode2"));
      const amountToSend = ethers.parseEther("10");
      const message: string = "Test message";

      await mockMonToken.connect(deployer).approve(await monadCrushEscrow.getAddress(), amountToSend);
      await monadCrushEscrow.connect(deployer).createClaim(claimCode, amountToSend, recipient.address, message);

      await expect(monadCrushEscrow.connect(deployer).createClaim(claimCode, amountToSend, recipient.address, message))
        .to.be.revertedWith("Claim already exists");
    });

    it("should not allow creating a claim with zero amount", async function () {
      const claimCode: string = ethers.keccak256(ethers.toUtf8Bytes("testcode3"));
      const amountToSend = ethers.parseEther("0");
      const message: string = "Test message";

      await expect(monadCrushEscrow.connect(deployer).createClaim(claimCode, amountToSend, recipient.address, message))
        .to.be.revertedWith("Amount must be greater than 0");
    });

    it("should fail if token transfer fails", async function () {
      const claimCode: string = ethers.keccak256(ethers.toUtf8Bytes("testcode4"));
      const amountToSend = ethers.parseEther("10000"); // More than deployer has
      const message: string = "Test message";

      await mockMonToken.connect(deployer).approve(await monadCrushEscrow.getAddress(), amountToSend);

      await expect(monadCrushEscrow.connect(deployer).createClaim(claimCode, amountToSend, recipient.address, message))
        .to.be.revertedWith("Token transfer failed");
    });
  });

  describe("claimTokens", function () {
    beforeEach(async function () {
      const claimCode: string = ethers.keccak256(ethers.toUtf8Bytes("preexistingcode"));
      const amountToSend = ethers.parseEther("50");
      const message: string = "Pre-existing claim";

      await mockMonToken.connect(deployer).approve(await monadCrushEscrow.getAddress(), amountToSend);
      await monadCrushEscrow.connect(deployer).createClaim(claimCode, amountToSend, recipient.address, message);
    });

    it("should allow the recipient to claim tokens", async function () {
      const claimCode: string = ethers.keccak256(ethers.toUtf8Bytes("preexistingcode"));
      const amountToSend = ethers.parseEther("50");

      const initialRecipientBalance = await mockMonToken.balanceOf(recipient.address);

      await expect(monadCrushEscrow.connect(recipient).claimTokens(claimCode))
        .to.emit(monadCrushEscrow, "Claimed")
        .withArgs(claimCode, amountToSend, recipient.address);

      const finalRecipientBalance = await mockMonToken.balanceOf(recipient.address);
      expect(finalRecipientBalance).to.equal(initialRecipientBalance + amountToSend);

      const claimInfo = await monadCrushEscrow.getClaimInfo(claimCode);
      expect(claimInfo.claimed).to.be.true;
    });

    it("should not allow a non-recipient to claim tokens", async function () {
      const claimCode: string = ethers.keccak256(ethers.toUtf8Bytes("preexistingcode"));

      await expect(monadCrushEscrow.connect(otherUser).claimTokens(claimCode))
        .to.be.revertedWith("Only intended recipient can claim");
    });

    it("should not allow claiming already claimed tokens", async function () {
      const claimCode: string = ethers.keccak256(ethers.toUtf8Bytes("preexistingcode"));

      await monadCrushEscrow.connect(recipient).claimTokens(claimCode);

      await expect(monadCrushEscrow.connect(recipient).claimTokens(claimCode))
        .to.be.revertedWith("Tokens already claimed");
    });
  });

  describe("getClaimInfo", function () {
    it("should return correct claim information", async function () {
      const claimCode: string = ethers.keccak256(ethers.toUtf8Bytes("infocode"));
      const amountToSend = ethers.parseEther("25");
      const message: string = "Info message";

      await mockMonToken.connect(deployer).approve(await monadCrushEscrow.getAddress(), amountToSend);
      await monadCrushEscrow.connect(deployer).createClaim(claimCode, amountToSend, recipient.address, message);

      const claimInfo = await monadCrushEscrow.getClaimInfo(claimCode);
      expect(claimInfo.amount).to.equal(amountToSend);
      expect(claimInfo.recipient).to.equal(recipient.address);
      expect(claimInfo.claimed).to.be.false;
      expect(claimInfo.message).to.equal(message);
      expect(claimInfo.sender).to.equal(deployer.address);
    });
  });
});


