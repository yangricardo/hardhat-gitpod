
// This script assumes you are using a testing framework like Hardhat with ethers.js: 

// Please replace `"RexToken"` with the actual name of your contract if it's different, 
// and make sure to adjust the test according to the actual total supply and other specific 
// details of your contract.
// This script also assumes that the preminted tokens are assigned to the owner/deployer of the contract. 

const { expect } = require("chai"); 
const { ethers } = require("hardhat"); 

// Define the contract name in the global scope
const contractName = "RexToken";

describe(contractName, function () { 
    let Token; 
    let token; 
    let owner; 
    let addr1; 
    let addr2; 
    let addrs; 
    
    beforeEach(async function () { 
        // Use the contractName variable to get the ContractFactory
        Token = await ethers.getContractFactory(contractName); 
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners(); 
        // Deploy a new contract before each test
        token = await Token.deploy(); 
    });
        
    describe("Deployment", function () { 
        
        it("Should assign the total supply of tokens to the owner", async function () { 
            const ownerBalance = await token.balanceOf(owner.address); 
            expect(await token.totalSupply()).to.equal(ownerBalance); 
        }); 
    }); 
    
    describe("Transactions", function () { 
        it("Should transfer tokens between accounts", async function () { 
            // Transfer 50 tokens from owner to addr1. 
            await token.transfer(addr1.address, 50); 
            const addr1Balance = await token.balanceOf(addr1.address); 
            expect(addr1Balance).to.equal(50); 
            // Transfer 50 tokens from addr1 to addr2. 
            // We use .connect(signer) to send a transaction from another account. 
            await token.connect(addr1).transfer(addr2.address, 50); 
            const addr2Balance = await token.balanceOf(addr2.address); 
            expect(addr2Balance).to.equal(50); 
        }); 
        
        it("Should fail if sender doesn’t have enough tokens", async function () { 
            const initialOwnerBalance = await token.balanceOf(owner.address); 
            // Try to send 1 token from addr1 (0 tokens) to owner (10000 tokens). 
            // `require` will evaluate false and revert the transaction. 
            await expect(token.connect(addr1).transfer(owner.address, 1)).to.be.reverted;
            // Owner balance shouldn't have changed. 
            expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance); 
        }); 
    }); 
});

