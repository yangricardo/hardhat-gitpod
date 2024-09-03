const { ethers } = require("hardhat");

// Define the contract name in the global scope
const contractName = "RexToken";

async function main() { 
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // The contract to deploy
    const Token = await ethers.getContractFactory(contractName); 
    const myToken = await Token.deploy();

    await myToken.waitForDeployment();

    // No need to call .deployed() here, as myToken is already the deployed contract instance
    console.log("Token deployed to:", myToken.target); 
} 

main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
});
