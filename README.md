# hardhat gitpod

This project is a boilerplate for building smart contracts for EVM copatible networks using HardHat on https://Gitpod.io. You can do your entire development in the cloud environment. No need to install anything locally, just a web browser is enough. 

Compile, test and deploy a smart contract to the Polygon Mumbai test network, then interact with it. Get all of the knowledge and tools you need in order to deploy your own smart contracts to the blockchain. 

**Before you begin** - Read through this document and examine the project structure and code. Make sure you understand what each code and terminal command does. Don't trust anyone!

## Version 0.0.2 - Multiple contracts

- Added a basic ERC20 contract, based on [OpenZepplin Wizard](https://wizard.openzeppelin.com/) templates
- Modified folder structure and documentation to accommodate multiple contracts
- Coming up next: ERC721 and ERC1155 contracts

## It starts from the most basic setup possible:

1. A package.json that includes all of the necessary packages for HardHat development
2. A .gitpod.yml that runs npm install
3. This README.md file with all of the instructions you need
4. A [DEVLOG.md](DEVLOG.md) file that documents the entire development process I did in a blog format, just in case you are interested, or if you are looking for a solution to a specific problem. I hope you find it educational and useful. 
5. The /contracts, /scripts and /tests

## How to develop, test and deploy your contracts

You can find individual contracts under their respective subfolders under the /contracts, /scripts and /tests folders.

All contracts can be compiled, tested and deployed to Polygon Mumbai. This will allow you to safely experiment without spending your real Ether or Matic.

Start off by compiling, testing, deploying and interacting with the /contracts/Lock/Lock.sol contract first. Once you have successfully done that, move on to the others.

### Install MetaMask, setup your Alchemy account and get some test Matic

- Install the MetaMask extension from the Chrome webstore
- Register to https://alchemy.com (Please don't trust my links blindly. Type links into your browser manually for best security)
- Create a new Alchemy app on the dashboard. Enter the app details
- From the menu press 'Add to wallet'. This will add the Alchemy RPC endpoint to your Metamask for Polygon Mumbai
- From the menu press 'Get test tokens'
- Copy your wallet address and paste into the Alchemy faucet. You got test MATIC!

### Set your blockchain RPC endpoint and wallet's private key in .env

- Copy the .env-example file to .env
- From your Alchemy App's dashboard, press 'API Key' and copy the HTTPS field to .env ALCHEMY_API_URL
- Copy your Metamask account's private key to .env PRIVATE_KEY
- Save .env

Now your are ready to interact with the Polygon Mumbai blockchain. Please note that the network settings can be found in hardhat.config.js.

### Compile, test and deploy the Lock.sol contract

The test contract is under ./contracts/Locak/Lock.sol. We are now going to compile, test and deploy it, then interact with it. 

```bash
$ npx hardhat compile
$ npx hardhat test tests/Lock/testLock.js
```

If the compilation and test go through well, deploy to Polygon Mumbai

```bash
$ npx hardhat run scripts/Lock/deployLock.js --network mumbai
```

If the contract is successfully deployed, you should get a contract address

### Locate your contract on Polygonscan

Open https://mumbai.polygonscan.com/ and search for your contract address. Examine the contract creation transaction. How much did it cost to deploy the contract?

### Save your contract address in the environment variables

Copy the contract address and save it to LOCK_CONTRACT_ADDRESS in .env. 

**IMPORTANT:** Remove the 0x from the beginning of the address in the .env variable. For example, if the contract address is 0x6B9dcebAE60Dcb9709CEaAE8dbE218DfB33a5E18, the variable definition should be 

```text
LOCK_CONTRACT_ADDRESS=6B9dcebAE60Dcb9709CEaAE8dbE218DfB33a5E18
```

## Interact with your contract on the blockchain

Now that your contract is deployed and its address is defined in the environment variables, it's time to use the ./scripts/interactWithLock.js script to see if Mumbai is willing to provide services based on it. 

Take a look at the code in ./scripts/interactWithLock.js. Try to locate the variable that reads the contract address from .env. 

Now let's put it to the test:

```bash
$ npx hardhat run scripts/Lock/interactWithLock.js --network mumbai
```

Was your withdrawal successful? I hope it was. 

Open your Alchemy app dashboard and take a look at the request log at the bottom of the app dashboard. Which requests did the interaction script make to the blockchain? 

## Congrats! You have a working HardHat environment

Now is the time to start exprimenting with [OpenZeppelin](https://wizard.openzeppelin.com/)

You have 3 basic contracts under the /contracts folder:

- ERC20
- ERC721
- ERC1155

For each contract you develop there should be 4 files:

1. The contract itself (a Solidity file). For example, /contracts/ERC20/BasicERC20.sol
2. A test script. For example /tests/ERC20/testBasicERC20.js
3. A deployment script. For example, /scripts/ERC20/deployBasicERC20.js
4. An interaction script (also for testing purposes, but also for development). For example, /scripts/ERC20/interactWithBasicERC20.js

## Clean your environment

In order to create a new contract, it is advised to start a new repo:

- Save your environment variables somewhere
- Fork this project
- Make sure you have all of the contract related files in their respective locations for compiling, testing, deployment and interaction. 
- Set your Alchemy and private key environment variables in the new project

Whenever you would like to get rid of contract compilation artifacts in your project, run the follwind command:

```bash
$ npx hardhat clean
```

## Step by step - Deploy an ERC20 contract

- Open /contracts/ERC20/BasicERC20.sol
- Modify the contract name, token name, symbol and total supply. Save
- Compile and test the contract
- Deploy the contract to Mumbai
- Interact with the contract

### Modify the contract name and token name and symbol

The BasicERC20.sol contract is very short. Let's call our contract RexToken. We are defining a contract with the following traits:

- It is called RexToken
- The token is of type ERC20
- It uses the ERC20Permit extension for gasless transactions
- The symbol is REX
- The total supply is 21 Million tokens (Sent to your wallet upon deployment)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/// @custom:security-contact your@email.com
contract RexToken is ERC20, ERC20Permit {
    constructor() ERC20("RexToken", "REX") ERC20Permit("RexToken") {
        _mint(msg.sender, 21000000 * 10 ** decimals());
    }
}
```

### Compile and test the contract

Our compilation process compiles all contracts at once like this:

```bash
$ npx hardhat compile
```

Testing must reference a specific test file. For example:


```bash
$ npx hardhat test tests/ERC20/testBasicERC20.js
```

If the compilation and test go through well, deploy to Polygon Mumbai

### Deploy the contract to Mumbai

```bash
$ npx hardhat run scripts/ERC20/deployBasicERC20.js --network mumbai
```

If the contract is successfully deployed, you should get a contract address. Save it in your .env file under the appropriate variable. Don't use 0x in .env. If your contract address is 0x345678765434567876567, use 345678765434567876567 instead. The 0x is added as part of the string in the script that reads this address from .env. 

### Interact with the contract

Now that your ERC20 is deployed, let's see how many tokens you have in your wallet:

```bash
$ npx hardhat run scripts/ERC20/interactWithBasicERC20.js --network mumbai
```

Go through the code for the above script and answer the following questions:

- Which library does it use to get your walled address?
- How does it get the token balance from your wallet?

## Next up, build a front end web app for your contract

Well done, you are an Ethereum contract deployer. Try to experiment with various types of contracts and interacting with them. What are their limitations? How would you modify the contract in order to provide a new type of service?

Now that you know how to deploy smart contract and interact with them, why not let others play around with their features? Learn how to create a front end web app for your smart contract and deploy it to the web (or even to IPFS), then let users log in with MetaMask and interact with your smart contract. 