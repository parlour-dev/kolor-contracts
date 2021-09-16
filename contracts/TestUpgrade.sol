// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract TestUpgrade is Initializable {
    struct Content {
        address payable author;
        string header;
    }

    Content[] public content;

    mapping(address => uint256) accountBalances;

    function test() external pure returns (uint) {
        return 123;
    }

    function getLastContentAuthor() external view returns(address) {
        return content[content.length-1].author;
    }
}