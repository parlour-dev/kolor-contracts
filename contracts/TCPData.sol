// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

//import "hardhat/console.sol";

contract TCPData {
    event ContentAdded(uint indexed idx);

    struct Content {
        address payable author;
        string header;
    }

    Content[] public content;

    mapping(address => uint256) accountBalances;

    constructor () {
        content.push(Content({ author: payable(msg.sender), header: '{"title": "The First Text Post", "tags": ["text", "first", "small"], "url": "https://ipfs.io/ipfs/QmNrgEMcUygbKzZeZgYFosdd27VE9KnWbyUD73bKZJ3bGi"}' }));
    }

    function addContent(string calldata newHeader) public {
        content.push(Content({author: payable(msg.sender), header: newHeader }));
        emit ContentAdded(content.length-1);
    }

    function getContentLength() public view returns (uint) {
        return content.length;
    }

    function getLastContent() public view returns (string memory, address payable, uint) {
        uint256 lastIdx = content.length-1;
        return (content[lastIdx].header, content[lastIdx].author, lastIdx);
    }

    function getContent() public view returns (Content[] memory) {
        return content;
    }

    function tipAuthor(uint idx) public payable {
        accountBalances[content[idx].author] += msg.value;
    }

    function getBalance() public view returns (uint) {
        return accountBalances[msg.sender];
    }

    function withdrawBalance() public { 
        // checks-effects-interactions
        uint256 amount = accountBalances[msg.sender];
        accountBalances[msg.sender] = 0;
        //(bool transactionOk, ) = payable(msg.sender).call{ value: amount }("");
        //require(transactionOk);
        payable(msg.sender).transfer(amount);
    }
}