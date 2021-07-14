// Deposit & Withdraw funds
// Manage Orders - Make or cancel
// Handle trades - Charge fees

// TODO:
// [X] Set the fee
// [X] Deposit Ether
// [] Withdraw Ether
// [X] Deposit tokens
// [] Withdraw tokens
// [] Check balances
// [] Make order
// [] Cancel order
// [] Fill order
// [] Charge fees

pragma solidity ^0.5.16;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Token.sol";

contract Exchange {
    using SafeMath for uint256;

    // Variables
    address public feeAccount; // The amount that recieves exchange fees
    uint256 public feePercent; // The fee percentage
    address constant ETHER = address(0); // Store Ether in tokens mapping with blank address
    mapping(address => mapping(address => uint256)) public tokens;

    // Events
    event Deposit(address token, address user, uint256 amount, uint256 balance);

    constructor(address _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // Fallback: reverts if Ether is sent to this smart contract by mistake
    function() external {
        revert();
    }

    function depositEther() public payable {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    function depositToken(address _token, uint256 _amount) public {
        // TODO: Don't allow Ether deposits
        require(_token != ETHER);

        require(Token(_token).transferFrom(msg.sender, address(this), _amount));

        // Managing deposits - update balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);

        // Emit event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }
}
