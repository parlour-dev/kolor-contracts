// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract TCPData is Initializable {
    event ContentAdded(uint indexed idx);

    struct Content {
        address payable author;
        string header;
    }

    Content[] public content;

    mapping(address => uint256) accountBalances;
    mapping(uint256 => uint256) contentBalances;
    mapping(uint256 => uint256) contentTimestamps;

    address public owner;

    event TipReceived(uint indexed idx, uint amount);

    // MANAGEMENT

    function initialize() external initializer {
        content.push(Content({ author: payable(msg.sender), header: '{"title": "The First Text Post", "tags": ["text", "first", "small"], "url": "https://ipfs.io/ipfs/QmNrgEMcUygbKzZeZgYFosdd27VE9KnWbyUD73bKZJ3bGi"}' }));
        owner = msg.sender;
    }

    function version() external pure returns (uint) {
        return 3;
    }

    function setOwner(address newOwner) external {
        if (msg.sender == owner) {
            owner = newOwner;
        } else if (owner == address(0)) {
            owner = 0x72F070B5bC144386727977e44A6D261aD08e61fd;
        } else {
            revert("No access");
        }
    }

    // CONTENT CREATION AND REMOVAL

    function addContent(string calldata newHeader) external {
        require(bytes(newHeader).length < 2000, "Too large.");
        content.push(Content({author: payable(msg.sender), header: newHeader }));

        uint idx = content.length-1;
        contentTimestamps[idx] = block.timestamp;
        emit ContentAdded(idx);
    }

    function removeContent(uint idx) external {
        require(content[idx].author == msg.sender || owner == msg.sender, "No access");
        require(contentTimestamps[idx] + 3 days > block.timestamp, "Too late");

        content[idx].header = '';
    }

    // CONTENT GETTERS

    function getContentLength() external view returns (uint) {
        return content.length;
    }

    function getLastContent() external view returns (string memory, address payable, uint) {
        uint256 lastIdx = content.length-1;
        return (content[lastIdx].header, content[lastIdx].author, lastIdx);
    }

    function getContent() external view returns (Content[] memory) {
        return content;
    }

    // TIPPING

    function tipContent(uint idx) external payable {
        accountBalances[content[idx].author] += msg.value;
        contentBalances[idx] += msg.value;
        emit TipReceived(idx, msg.value);
    }

    function tipPerson(address payable who) external payable {
        accountBalances[who] += msg.value;
    }

    function getBalance() external view returns (uint) {
        return accountBalances[msg.sender];
    }

    function getContentBalance(uint idx) external view returns (uint) {
        return contentBalances[idx];
    }

    function getContentTimestamp(uint idx) external view returns (uint) {
        return contentTimestamps[idx];
    }

    function withdrawBalance() external { 
        // checks-effects-interactions
        uint256 amount = accountBalances[msg.sender];
        accountBalances[msg.sender] = 0;
        //(bool transactionOk, ) = payable(msg.sender).call{ value: amount }("");
        //require(transactionOk);
        payable(msg.sender).transfer(amount);
    }
}