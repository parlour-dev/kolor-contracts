// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract KolorToken is ERC777Upgradeable, OwnableUpgradeable {
    function initialize() initializer public {
        address[] memory defaultOps;

        __ERC777_init("KolorTest777", "KOL7", defaultOps);
        __Ownable_init();
    }

    function mint(uint256 amount) onlyOwner public {
        _mint(msg.sender, amount, "", "");
    }
}