// Deposit & Withdraw funds
// Manage Orders - Make or cancel
// Handle trades - Charge fees

// TODO:
// [X] Set the fee
// [X] Deposit Ether
// [X] Withdraw Ether
// [X] Deposit tokens
// [X] Withdraw tokens
// [X] Check balances
// [X] Make order
// [X] Cancel order
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
    mapping(uint256 => _Order) public orders;
    uint256 public orderCount;
    mapping(uint256 => bool) public orderCancelled;

    // Events
    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );
    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    // A way to model an order
    struct _Order {
        // Attributes of an order
        uint256 id;
        address user; // User who made the order
        address tokenGet; // Address of the token they want to purchase
        uint256 amountGet; // Amount they want to get
        address tokenGive; // Address of the token they want to give
        uint256 amountGive; // Amount they want to give
        uint256 timestamp; // When the order was created
    }

    constructor(address _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // Fallback: reverts if Ether is sent to this smart contract by mistake
    function() external {
        revert();
    }

    // ------------------------
    // DEPOSIT & WITHDRAW ETHER

    function depositEther() public payable {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);

        // Emit event
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    function withdrawEther(uint256 _amount) public {
        // Ensure address as enough Ether
        require(tokens[ETHER][msg.sender] >= _amount);

        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        msg.sender.transfer(_amount);

        // Emit event
        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    // ------------------------
    // DEPOSIT & WITHDRAW TOKEN

    function depositToken(address _token, uint256 _amount) public {
        // Don't allow Ether deposits
        require(_token != ETHER);
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));

        // Managing deposits - update balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);

        // Emit event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function withdrawToken(address _token, uint256 _amount) public {
        // Make sure it is not an Ether address & they have enough tokens to withdraw
        require(_token != ETHER);
        require(tokens[_token][msg.sender] >= _amount);

        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);

        require(Token(_token).transfer(msg.sender, _amount));

        // Emit event
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function balanceOf(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return tokens[_token][_user];
    }

    // ------------------------
    // MAKE & CANCEL ORDERS

    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        // Instantiate a new order
        orderCount = orderCount.add(1);
        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            now
        );

        // Emit event
        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            now
        );
    }

    function cancelOrder(uint256 _id) public {
        // Fetch the order
        _Order storage _order = orders[_id];

        // Ensure the caller of the function is the owner of the order
        require(address(_order.user) == msg.sender);

        // Order must exist
        require(_order.id == _id);

        // Cancel Order
        orderCancelled[_id] = true;
        emit Cancel(
            _order.id,
            msg.sender,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive,
            now
        );
    }
}
