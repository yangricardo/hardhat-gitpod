// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Replace RexToken with YourTokenName and REX with YRTKN symbol
// Set your own supply instead of 21000

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/// @custom:security-contact tailor.vj@gmail.com
contract RexToken is ERC20, ERC20Permit {
    constructor() ERC20("RexToken", "REX") ERC20Permit("RexToken") {
        _mint(msg.sender, 21000 * 10 ** decimals());
    }
}
