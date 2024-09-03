const hre = require("hardhat");
require('dotenv').config();

async function main() {
  // Contract address deployed on Mumbai
  const contractAddress = `0x${process.env.LOCK_CONTRACT_ADDRESS}`;

  // The ABI (Application Binary Interface) of the Lock contract
  const abi = [
    "function unlockTime() public view returns (uint)",
    "function withdraw() public",
    "event Withdrawal(uint amount, uint when)"
  ];

  // Connect to the deployed contract
  const [deployer] = await hre.ethers.getSigners();
  const lockContract = new hre.ethers.Contract(contractAddress, abi, deployer);

  // Read the unlock time
  try {
    const unlockTime = await lockContract.unlockTime();
    console.log(`Unlock Time: ${unlockTime.toString()}`);
  } catch (error) {
    console.error("Error reading unlock time:", error);
  }

  // Attempt to withdraw (this will only succeed if the unlock time has passed and the caller is the owner)
  try {
    console.log("Attempting to withdraw...");
    const withdrawTx = await lockContract.withdraw();
    await withdrawTx.wait();
    console.log("Withdrawal successful.");
  } catch (error) {
    console.error("Error during withdrawal:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
