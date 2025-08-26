// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const ProofVault = await hre.ethers.getContractFactory("ProofVault");
  const Storage = await hre.ethers.getContractFactory("Storage");

  // Deploy the contract (this returns the deployed instance directly in Ethers v6+)
  const proofVault = await ProofVault.deploy();
  const storage = await Storage.deploy();

  // Wait for deployment to complete
  await proofVault.waitForDeployment(); // <== THIS is the correct method in Ethers v6+
  await storage.waitForDeployment();

  const address = await proofVault.getAddress(); // Get deployed contract address
  const address_storage = await storage.getAddress();

  console.log(`✅ ProofVault deployed to: ${address}`);
  console.log(`✅ Storage deployed to: ${address_storage}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
