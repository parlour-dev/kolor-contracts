// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract KolorToken is ERC777Upgradeable, OwnableUpgradeable {
    function initialize() initializer public {
        address[] memory defaultOps;

        __ERC777_init("Kolor", "KOL", defaultOps);
        __Ownable_init();

        // 10_000_000 for the liquidity pool
        //  2_000_000 for airdrops and events
        //  3_000_000 for 300 days of distributing to posts
        _mint(msg.sender, 15_000_000, "", "");
    }

    function mint(uint256 amount) onlyOwner public {
        _mint(msg.sender, amount, "", "");
    }
}