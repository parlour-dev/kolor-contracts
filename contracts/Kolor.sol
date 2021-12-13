// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.2;

//import "@openzeppelin/contracts-upgradeable/token/ERC777/presets/ERC777PresetFixedSupplyUpgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol";
//import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract KolorToken is ERC20Upgradeable, OwnableUpgradeable {
    function initialize(address owner) initializer public {
        __ERC20_init("KolorTEST", "KOLT");
        __Ownable_init();
        _transferOwnership(owner);
    }

    function mint(uint256 amount) onlyOwner public {
        _mint(msg.sender, amount);
    }
}