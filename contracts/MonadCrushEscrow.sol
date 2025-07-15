// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MonadCrushEscrow is Ownable {
    IERC20 public monToken;

    struct Claim {
        uint256 amount;
        address recipient;
        bool claimed;
        string message;
        address sender;
    }

    mapping(bytes32 => Claim) public claims;

    event ClaimCreated(bytes32 indexed claimCodeHash, uint256 amount, address recipient, address sender);
    event Claimed(bytes32 indexed claimCodeHash, uint256 amount, address recipient);

    constructor(address _monTokenAddress) Ownable(msg.sender) {
        monToken = IERC20(_monTokenAddress);
    }

    function createClaim(bytes32 _claimCodeHash, uint256 _amount, address _recipient, string memory _message) public payable {
        require(!claims[_claimCodeHash].claimed, "Claim already exists");
        require(_amount > 0, "Amount must be greater than 0");
        require(monToken.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");

        claims[_claimCodeHash] = Claim({
            amount: _amount,
            recipient: _recipient,
            claimed: false,
            message: _message,
            sender: msg.sender
        });

        emit ClaimCreated(_claimCodeHash, _amount, _recipient, msg.sender);
    }

    function claimTokens(bytes32 _claimCodeHash) public {
        Claim storage claim = claims[_claimCodeHash];
        require(claim.recipient == msg.sender, "Only intended recipient can claim");
        require(!claim.claimed, "Tokens already claimed");

        claim.claimed = true;
        require(monToken.transfer(msg.sender, claim.amount), "Token transfer failed");

        emit Claimed(_claimCodeHash, claim.amount, msg.sender);
    }

    function getClaimInfo(bytes32 _claimCodeHash) public view returns (uint256 amount, address recipient, bool claimed, string memory message, address sender) {
        Claim storage claim = claims[_claimCodeHash];
        return (claim.amount, claim.recipient, claim.claimed, claim.message, claim.sender);
    }

    function withdrawStuckTokens(address _tokenAddress) public onlyOwner {
        IERC20 stuckToken = IERC20(_tokenAddress);
        stuckToken.transfer(owner(), stuckToken.balanceOf(address(this)));
    }

    receive() external payable {
        // Allow receiving Ether for potential future use or if sent by mistake
    }

    fallback() external payable {
        // Allow receiving Ether for potential future use or if sent by mistake
    }
}


