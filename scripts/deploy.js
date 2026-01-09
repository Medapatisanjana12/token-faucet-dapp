const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with account:", deployer.address);

  // 1️⃣ Deploy Token
  const Token = await hre.ethers.getContractFactory("YourToken");

  const token = await Token.deploy(
    "MyToken",                 // name
    "MTK",                     // symbol
    hre.ethers.utils.parseEther("1000000"), // max supply
    deployer.address           // temporary faucet/admin
  );

  await token.deployed();
  console.log("Token deployed to:", token.address);

  // 2️⃣ Deploy Faucet
  const Faucet = await hre.ethers.getContractFactory("TokenFaucet");

  const faucet = await Faucet.deploy(token.address);
  await faucet.deployed();

  console.log("Faucet deployed to:", faucet.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
