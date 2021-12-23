// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

contract KolorData is ERC721Upgradeable, OwnableUpgradeable {
    event ContentAdded(uint indexed idx, address indexed author);

    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIds;

    mapping(uint256 => uint256) postTimestamps;

    function initialize() public initializer {
        __ERC721_init("KolorData", "POST");
        __Ownable_init();
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://posts.kolor.social/";
    }

    function version() external pure returns (uint256) {
        return 6;
    }

    function createPost() external returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        postTimestamps[newItemId] = block.timestamp;

        emit ContentAdded(newItemId, msg.sender);

        return newItemId;
    }

    function createPostAs(address poster) onlyOwner external returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(poster, newItemId);
        postTimestamps[newItemId] = block.timestamp;

        emit ContentAdded(newItemId, poster);

        return newItemId;
    }

    function burnPost(uint256 id) external {
        require(_isApprovedOrOwner(msg.sender, id) || msg.sender == owner(), "Not allowed");
        require(postTimestamps[id] + 3 days > block.timestamp, "Too late");

        _burn(id);
    }

    function getPostTimestamp(uint256 id) external view returns (uint256) {
        return postTimestamps[id];
    }

    function getLastPostId() external view returns (uint256) {
        return _tokenIds.current();
    }
}