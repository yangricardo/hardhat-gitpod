# Contract details

This project features many different contracts. The purpose of this document is to provide some basic details about each contract, what it's used for and what kind of interactions it allows. 

## BasicERC20

The most basic ERC20 contract creates a fungible token that adheres to the ERC20 standard. It allows users to: - Hold a balance of tokens in their Ethereum account. - Transfer tokens to other accounts. - Allow other accounts to transfer tokens on their behalf (if they approve them). This standard provides a set of functions to interact with the token, including `balanceOf` to check an account's balance, `transfer` to move tokens between accounts, `approve` to authorize another account to spend tokens, and `transferFrom` for a third party to transfer tokens if they have been allowed to do so. The contract keeps track of how many tokens each address has and updates these balances as tokens are transferred. This basic functionality is the core of any ERC20 token and is what makes it interoperable with wallets and other smart contracts that support the ERC20 standard.

### ERC20Permit

```solidity
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
```

Implementation of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in EIP-2612.

Users would always need to submit transactions and pay gas fees to approve token transfers for third parties. - It wouldn't support gasless transactions where token holders sign a message to grant spending rights without making a blockchain transaction. - The user experience might be less efficient for some decentralized applications (dApps) that utilize permit for one-transaction approvals and transfers.