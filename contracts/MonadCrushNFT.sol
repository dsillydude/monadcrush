// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MonadCrushNFT is ERC721, ERC721URIStorage, Ownable {
    IERC20 public monToken;
    uint256 public mintPrice;
    uint256 private _nextTokenId;

    struct MatchCard {
        string matchedUser;
        uint256 compatibilityScore;
        string matchReason;
        uint256 timestamp;
        address minter;
    }

    mapping(uint256 => MatchCard) public matchCards;

    event MatchCardMinted(uint256 indexed tokenId, address indexed minter, string matchedUser, uint256 compatibilityScore);

    constructor(address _monTokenAddress, uint256 _mintPrice) ERC721("MonadCrush Match Card", "MCMC") Ownable(msg.sender) {
        monToken = IERC20(_monTokenAddress);
        mintPrice = _mintPrice;
        _nextTokenId = 1;
    }

    function mintMatchCard(
        string memory _matchedUser,
        uint256 _compatibilityScore,
        string memory _matchReason,
        string memory _tokenURI
    ) public returns (uint256) {
        require(_compatibilityScore <= 100, "Compatibility score must be <= 100");
        require(monToken.transferFrom(msg.sender, address(this), mintPrice), "Payment failed");

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        matchCards[tokenId] = MatchCard({
            matchedUser: _matchedUser,
            compatibilityScore: _compatibilityScore,
            matchReason: _matchReason,
            timestamp: block.timestamp,
            minter: msg.sender
        });

        emit MatchCardMinted(tokenId, msg.sender, _matchedUser, _compatibilityScore);
        return tokenId;
    }

    function getMatchCard(uint256 tokenId) public view returns (MatchCard memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return matchCards[tokenId];
    }

    function setMintPrice(uint256 _newPrice) public onlyOwner {
        mintPrice = _newPrice;
    }

    function withdrawTokens() public onlyOwner {
        uint256 balance = monToken.balanceOf(address(this));
        require(monToken.transfer(owner(), balance), "Transfer failed");
    }

    // Override required by Solidity
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

