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

    event TipReceived(uint indexed idx, uint amount);

    function initialize() external initializer {
        content.push(Content({ author: payable(msg.sender), header: '{"title": "The First Text Post", "tags": ["text", "first", "small"], "url": "https://ipfs.io/ipfs/QmNrgEMcUygbKzZeZgYFosdd27VE9KnWbyUD73bKZJ3bGi"}' }));
    }

    function addContent(string calldata newHeader) external {
        require(bytes(newHeader).length < 2000, "Too large.");
        content.push(Content({author: payable(msg.sender), header: newHeader }));
        emit ContentAdded(content.length-1);
    }

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

    function withdrawBalance() external { 
        // checks-effects-interactions
        uint256 amount = accountBalances[msg.sender];
        accountBalances[msg.sender] = 0;
        //(bool transactionOk, ) = payable(msg.sender).call{ value: amount }("");
        //require(transactionOk);
        payable(msg.sender).transfer(amount);
    }
}