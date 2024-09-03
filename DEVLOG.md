# Devlog


## 2024-Feb-20 14:58

I successfully integrated a basic ERC20 contract into the solution. The folder structure has been updated a bit and I installed a few new libraries that I needed for development purposes. 

You can now create your own ERC20 token with an initial supply that is transferred to your wallet upon contract deployment. 

**Next steps:** 

- Implement ERC721, ERC1155
- Use ethers.js for deeper contract interactions
- Mint NFTs with metadata using IPFS/Filecoin/nft.storage, or something similar


## 2024-Feb-20 08:02

I started implementing a multiple contracts project structure. I am going to add subfolders for a few standard smart contract types under the contracts, scripts and test folders. 

My target contract types:

- ERC-20
- ERC-721
- ERC-1155

I will create the most basic contract first, then implement some variants with various OpenZeppelin features. 

I am using https://wizard.openzeppelin.com/ to generate the contracts. Starting with ERC-20.


## 2024-Feb-20 07:32

Updated ALCHEMY_API_URL default URL from Infura, which was a bit misleading, to Alchemy. 

## 2024-Feb-04 22:10

I started working on deploying my first test contract to Polygon Mumbai. 

I installed the hardhat-network-helpers library

```bash
$ npm install --save-dev hardhat-network-helpers
```

Then, I modified hardhat.config.js to support environment variables and added the following 2 variables to .env:

```javascript
ALCHEMY_API_URL=
PRIVATE_KEY=
```

hardhat.config.js now looks like this:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 80001, // Mumbai Testnet chain ID
    }
  }
};
```

### Let's test and deploy the default Lock.sol contract

The Lock.sol contract code:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Lock {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(uint amount, uint when);

    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }
}
```

```bash
$ npx hardhat clean
$ npx hardhat compile
$ npx hardhat test
```

The test passed successfully. Deploying to Mumbai

```bash
$ npx hardhat run scripts/deploy.js --network mumbai
```

Initially, I forgot to save hardhat.config.js, so my deployment failed, but once I saved it and redployed, it successfully deployed to Polygon Mumbai

Here's my deployment transaction details on Polygonscan:
https://mumbai.polygonscan.com/tx/0x04cb0d4b6ac84cfb11ec538528b83732185e954d0a6138a2dd04925fd5f6ee2b

I created an interaction script called interactWithLock.js under scripts. 

```javascript
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
```

Running the interaction script on the command line:

```bash
$ npx hardhat run scripts/interactWithLock.js --network mumbai
```

Result:
```
Unlock Time: 1707081271
Attempting to withdraw...
Withdrawal successful.
```

So, basically, we have a working HardHat setup. Next phase - start testing with standard OpenZeppelin contracts. 

## 2024-Feb-04 20:48

I installed a new MetaMask and added the Polygon Mumbai testnet to it from my Alchemy dashboard. The nice thing about his approach is that the RPC endpoint is private and there is a lower level of risk compared to public RPC endpoints published on ChainList. 

All I had to do is log into my Alchemy dashboard, select an app that has a Mumbai RPC endpoint, open the app's menu and press 'add to wallet'. This automatically added Polygon Mumbai to my wallet with my own Alchemy RPC endpoint. 

Next, I opened the Metamask security and privacy tab and enabled 'show incoming transactions for Mumbai'

I also used Alchemy's faucet to get 0.5 test Matic for development. 

My next goal is to have an ERC-1155 contract compiled and deployed to Polygon Mumbai. I'll look for a project on Github that implements that, and I'll combine with code from OpenZeppeling wizard. 

https://wizard.openzeppelin.com/#erc721

I have discoverd that the OpenZeppelin wizard now has an AI chatbot built into it that can provide development advice, and implement some wizard settings within the contract on your behald. This is very user friendly and cool. 

I will probably be able to hold the metadata on IPFS, while building an artwork regeneration function for NFT holders, based on token id. 

I got some ideas about using an NFT supply monitor within the contract, in order to limit the maximum amount of NFTs available at any given time. 

## 2024-Feb-04 15:51

I successfully pushed the project to Github and opened it in a new Gitpod environment. I'm typing this in a VSCode instance which is already connected to Gitpod.io.

### Next steps - Hardhat npm modules

I'm following the Hardhat setup guide for TypeScript on https://hardhat.org/hardhat-runner/docs/guides/typescript

```bash
$ npm install --save-dev hardhat
```

This was the first npm installation in this project, so we now have a node_modules folder (untracked, but present on gitpod.io), and package.json has been updated with 

```json
  "devDependencies": {
    "hardhat": "^2.19.5"
  }
```
## 2024-Feb-04 19:19

I installed dotenv in the project in order to support secret keys in a .env file. 

```bash
$ npm install dotenv
```

dotenv added to package.json

```json
  "dependencies": {
    "dotenv": "^16.4.1"
  }
```
I decided to go for JavaScript, which is my preferred language over TypeScript

So, following the getting started tutorial for HardHat instead of the TypeScript tutorial

https://hardhat.org/hardhat-runner/docs/guides/project-setup

### Starting the project setup

```bash
$ npx hardhat init
```

I selected to add a JavaScript project and said yes to .gitignore addition as well. A few items have been added to .gitignore. 

This included installation of the HardHat Toolbox npm package, which has taken a couple of minutes to install.

```json
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^4.0.0",
    "hardhat": "^2.19.5"
  },
```

The following folders and files have been added to the project:

```bash
contracts/Lock.sol
scripts/deploy.js
test/Lock.js
hardhat.config.js
```

### hardhat.config.js

```javascript
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
};
```

I installed the [HardHat for VS Code Solidity extension](https://hardhat.org/hardhat-vscode/docs/overview) by pressing CTRL+P and pasting the following command:

```bash
ext install NomicFoundation.hardhat-solidity
```

### Compiling the test contract

```bash
$ npx hardhat compile
```

This created an /artifacts folder:

```bash
$ sudo apt-get install tree
$ tree ./artifacts

./artifacts
├── build-info
│   └── b9c730292f369bc8e3d66a02f50a4c4b.json
└── contracts
    └── Lock.sol
        ├── Lock.dbg.json
        └── Lock.json

3 directories, 3 files
```

### Starting to look into ERC-1155 and ERC-721 development

Now that I have compiling project, it's time to look into OpenZeppelin contract deployment. I looked into their contracts, and they seem to be using pragma solidity ^0.8.20. 

hardhat.config.js says we are using 0.8.19. So, I'm going to modify that to 0.8.20 instead and try to clean and recompile the text project. Let's see how that pans out. 

```javascript
module.exports = {
  solidity: "0.8.20",
};
```

#### Cleaning and recompiling

```bash
$ npx hardhat clean
$ npx hardhat compile
```

This caused the artifacts folder to be deleted, compiler version 0.8.20 to be downloaded and used, then the entire artifact folder recompiled from scratch. 

## 2024-Feb-04 15:29

I started this new project under nodejs-projects/Web3/hardhat-gitpod.

I'm following the HardHat TypeScript setup guide on https://hardhat.org/hardhat-runner/docs/guides/typescript

### First step - Github and Gitpod

Before diving into the Hardhat setup instructions, which demand installing various npm modules (which I wouldn't like to do on my local system), I've set up a basic npm project with 

```bash
$ npm init -y
```

I created the following .gitpod.yml

```yaml
# List the start up tasks. Learn more https://www.gitpod.io/docs/config-start-tasks/
tasks:
  - name: Start development environment
    init: npm install
```

and created a basic .gitignore file to make sure node_modules and .env never get into source control

```
node_modules
.env
```

I'm documenting my work in this DEVLOG.md file and updating the [README.md](README.md) with setup and development instructions

#### Github

I created a new Github project on https://github.com/tailorvj/hardhat-gitpod

I used the following commands to push it to Github:

```bash
git init
git add .
git commit -m "default npm project setup for gitpod.io"
git branch -M main
git remote add origin git@github.com:tailorvj/hardhat-gitpod.git
git push -u origin main
```