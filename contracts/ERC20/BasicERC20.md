# Notes related to the BasicERC20.sol contract

## Compile, test, deploy and interact with the BasicERC20.sol contract

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

## The basic ERC20 contract does not implement Ownable

The `Ownable` feature in smart contracts provides a simple access control mechanism where there is a single account (the owner) that is privileged to perform certain actions. These actions often include sensitive functions like updating contract parameters or performing administrative tasks. 

If the ERC20 contract you are using does not include the `Ownable` module, it means that there is no single account with special permissions. All actions that might have required ownership in another contract context would either be public (meaning any user can call them if the contract logic allows it) or the contract might use a different access control system (like role-based access control). 

If you need to add an ownership feature to your contract or you want to test functions that require ownership without using the `Ownable` module, consider the following courses of action: 

1. **Add `Ownable` Module**: Modify the contract to include the `Ownable` module from OpenZeppelin, which will introduce the ownership feature to your contract. 
2. **Use Role-Based Access Control**: Implement a role-based access control system like `AccessControl` from OpenZeppelin, which allows for multiple accounts to have different permissions. 
3. **Public Functions**: If the contract functions are intended to be public and not require special permissions, you can test them as-is without any ownership considerations. 
4. **Custom Access Control**: Create a custom access control mechanism tailored to the specific needs of your contract. 

If you want to proceed with any of these options, let me know which one you choose, and I can assist you in updating your contract accordingly.

Access control in an ERC20 contract is independent of the token exchange functionality. The ERC20 standard ensures that the basic token transfer, allowance, and balance mechanisms function without any access control requirements. 

The primary purpose of access control in ERC20 contracts is to manage privileged actions such as minting new tokens, pausing the contract, or upgrading the contract if it's upgradeable. 

If your ERC20 contract has all tokens minted at deployment and does not require any privileged actions post-deployment, you can choose not to implement any access control mechanisms. This means that no one, not even the deployer, will have special permissions, and the token will solely serve as a medium of exchange. 

However, it's worth considering future scenarios where you might need to pause the contract in case of a vulnerability, upgrade the contract, or interact with it in a privileged manner. If you foresee any such needs, implementing access control from the beginning could be beneficial. 

If you decide not to implement access control, ensure that this is clearly communicated to users, and they understand the implications.