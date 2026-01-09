// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YourToken is ERC20, Ownable {
    uint256 public immutable MAX_SUPPLY;
    address public faucet;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxSupply_,
        address faucet_
    )
        ERC20(name_, symbol_)
        Ownable(msg.sender)   // ✅ FIX: pass initial owner
    {
        require(faucet_ != address(0), "Invalid faucet address");
        MAX_SUPPLY = maxSupply_;
        faucet = faucet_;
    }

    modifier onlyFaucet() {
        require(msg.sender == faucet, "Only faucet can mint");
        _;
    }

    function mint(address to, uint256 amount) external onlyFaucet {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }
}
