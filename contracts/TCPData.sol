// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC777/IERC777RecipientUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC777/IERC777SenderUpgradeable.sol";

import "@openzeppelin/contracts/utils/introspection/ERC1820Implementer.sol";
import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";

import "@openzeppelin/contracts/token/ERC777/IERC777.sol";

import "hardhat/console.sol";

contract TCPData is IERC777RecipientUpgradeable, Initializable, ERC1820Implementer {
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
    event ERC777TipReceived(uint indexed idx, address indexed author, uint amount);

    // ERC-777 callbacks
    // https://forum.openzeppelin.com/t/simple-erc777-token-example/746
    IERC1820Registry private _erc1820;
    bytes32 constant private TOKENS_RECIPIENT_INTERFACE_HASH = keccak256("ERC777TokensRecipient");
    bytes32 constant public TOKENS_SENDER_INTERFACE_HASH = keccak256("ERC777TokensSender");

    function senderFor(address account) public {
        _registerInterfaceForAddress(TOKENS_SENDER_INTERFACE_HASH, account);
    }

    // MANAGEMENT

    function initialize() external initializer {
        owner = 0x72F070B5bC144386727977e44A6D261aD08e61fd;
        _erc1820 = IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
        _erc1820.setInterfaceImplementer(address(this), TOKENS_RECIPIENT_INTERFACE_HASH, address(this));
    }

    function version() external pure returns (uint) {
        return 5;
    }

    function setOwner(address newOwner) external {
        if (msg.sender == owner) {
            owner = newOwner;
        } else {
            revert("No access");
        }
    }

    // CONTENT CREATION AND REMOVAL

    function addContentAs(address payable creator, string calldata newHeader) public {
        require(msg.sender == owner, "No access");
        addContentInternal(creator, newHeader);
    }

    function addContent(string calldata newHeader) external {
        addContentInternal(payable(msg.sender), newHeader);
    }

    function addContentInternal(address payable creator, string calldata newHeader) private {
        require(bytes(newHeader).length < 2000, "Too large.");
        content.push(Content({ author: creator, header: newHeader }));

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

    // TOKENS (ERC777)

    /**
     * @dev Called by an {IERC777} token contract whenever tokens are being
     * moved or created into a registered account (`to`). The type of operation
     * is conveyed by `from` being the zero address or not.
     *
     * @param userData should contain the id of the post TODO: fix this
     */
    function tokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) external override {
        require(userData.length == 52, "wrong data size");

        uint256 idx;
        address token;
        bytes memory tmp = userData;

        assembly {
            idx := mload(add(tmp, 0x20))
            token := mload(add(tmp, 0x34))
        }

        require(idx < content.length, "id out of range");

        emit ERC777TipReceived(idx, content[idx].author, amount);

        IERC777 token_contract = IERC777(token);
        token_contract.send(content[idx].author, amount, "");
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

    function getBalance(address target) external view returns (uint) {
        return accountBalances[target];
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