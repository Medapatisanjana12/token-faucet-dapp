const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token & TokenFaucet", function () {
  let Token, Faucet, token, faucet;
  let owner, user1, user2;
  const MAX_SUPPLY = ethers.parseEther("1000000");
  const FAUCET_AMOUNT = ethers.parseEther("100");
  const MAX_CLAIM = ethers.parseEther("1000");
  const COOLDOWN = 24 * 60 * 60;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    Token = await ethers.getContractFactory("YourToken");
    Faucet = await ethers.getContractFactory("TokenFaucet");

    // Deploy faucet placeholder first (token address set later)
    token = await Token.deploy(
      "YourToken",
      "YTK",
      MAX_SUPPLY,
      owner.address
    );

    faucet = await Faucet.deploy(token.target);

    // Update faucet address in token (redeploy token correctly)
    token = await Token.deploy(
      "YourToken",
      "YTK",
      MAX_SUPPLY,
      faucet.target
    );
  });

  /* ------------------------------------------------ */
  /* 1. Token deployment and initial state            */
  /* ------------------------------------------------ */
  it("Should deploy token with correct parameters", async function () {
    expect(await token.name()).to.equal("YourToken");
    expect(await token.symbol()).to.equal("YTK");
    expect(await token.MAX_SUPPLY()).to.equal(MAX_SUPPLY);
    expect(await token.totalSupply()).to.equal(0);
  });

  /* ------------------------------------------------ */
  /* 2. Faucet deployment and configuration           */
  /* ------------------------------------------------ */
  it("Should deploy faucet with correct admin and token", async function () {
    expect(await faucet.admin()).to.equal(owner.address);
    expect(await faucet.token()).to.equal(token.target);
    expect(await faucet.isPaused()).to.equal(false);
  });

  /* ------------------------------------------------ */
  /* 3. Successful token claim                        */
  /* ------------------------------------------------ */
  it("Should allow user to claim tokens successfully", async function () {
    await faucet.connect(user1).requestTokens();
    expect(await token.balanceOf(user1.address)).to.equal(FAUCET_AMOUNT);
  });

  /* ------------------------------------------------ */
  /* 4. Cooldown enforcement                          */
  /* ------------------------------------------------ */
  it("Should revert if user claims before cooldown", async function () {
    await faucet.connect(user1).requestTokens();

    await expect(
      faucet.connect(user1).requestTokens()
    ).to.be.revertedWith("Not eligible to claim");
  });

  it("Should allow claim after cooldown passes", async function () {
    await faucet.connect(user1).requestTokens();

    await ethers.provider.send("evm_increaseTime", [COOLDOWN + 1]);
    await ethers.provider.send("evm_mine");

    await faucet.connect(user1).requestTokens();
    expect(await token.balanceOf(user1.address)).to.equal(
      FAUCET_AMOUNT * 2n
    );
  });

  /* ------------------------------------------------ */
  /* 5. Lifetime limit enforcement                    */
  /* ------------------------------------------------ */
  it("Should enforce lifetime claim limit", async function () {
    for (let i = 0; i < 10; i++) {
      await faucet.connect(user1).requestTokens();
      await ethers.provider.send("evm_increaseTime", [COOLDOWN + 1]);
      await ethers.provider.send("evm_mine");
    }

    await expect(
      faucet.connect(user1).requestTokens()
    ).to.be.revertedWith("Lifetime claim limit reached");
  });

  /* ------------------------------------------------ */
  /* 6. Pause mechanism                               */
  /* ------------------------------------------------ */
  it("Should prevent claims when paused", async function () {
    await faucet.setPaused(true);

    await expect(
      faucet.connect(user1).requestTokens()
    ).to.be.revertedWith("Faucet is paused");
  });

  /* ------------------------------------------------ */
  /* 7. Admin-only pause function                     */
  /* ------------------------------------------------ */
  it("Should allow only admin to pause/unpause", async function () {
    await expect(
      faucet.connect(user1).setPaused(true)
    ).to.be.revertedWith("Only admin");

    await faucet.setPaused(true);
    expect(await faucet.isPaused()).to.equal(true);
  });

  /* ------------------------------------------------ */
  /* 8. Event emissions                               */
  /* ------------------------------------------------ */
  it("Should emit TokensClaimed event", async function () {
    await expect(faucet.connect(user1).requestTokens())
      .to.emit(faucet, "TokensClaimed")
      .withArgs(
        user1.address,
        FAUCET_AMOUNT,
        await ethers.provider.getBlock("latest").then(b => b.timestamp + 1)
      );
  });

  it("Should emit FaucetPaused event", async function () {
    await expect(faucet.setPaused(true))
      .to.emit(faucet, "FaucetPaused")
      .withArgs(true);
  });

  /* ------------------------------------------------ */
  /* 9. Edge cases                                    */
  /* ------------------------------------------------ */
  it("Should return correct remaining allowance", async function () {
    await faucet.connect(user1).requestTokens();
    const remaining = await faucet.remainingAllowance(user1.address);
    expect(remaining).to.equal(MAX_CLAIM - FAUCET_AMOUNT);
  });

  it("Should return zero remaining allowance when max reached", async function () {
    for (let i = 0; i < 10; i++) {
      await faucet.connect(user1).requestTokens();
      await ethers.provider.send("evm_increaseTime", [COOLDOWN + 1]);
      await ethers.provider.send("evm_mine");
    }

    expect(await faucet.remainingAllowance(user1.address)).to.equal(0);
  });

  /* ------------------------------------------------ */
  /* 10. Multiple users claiming independently        */
  /* ------------------------------------------------ */
  it("Should allow multiple users to claim independently", async function () {
    await faucet.connect(user1).requestTokens();
    await faucet.connect(user2).requestTokens();

    expect(await token.balanceOf(user1.address)).to.equal(FAUCET_AMOUNT);
    expect(await token.balanceOf(user2.address)).to.equal(FAUCET_AMOUNT);
  });
});
