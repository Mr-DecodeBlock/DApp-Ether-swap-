
pragma solidity 0.5.16;

import './Token.sol';

contract EthSwap {
    string public name = 'EthSwap Instant Exchange'; //Stae variable
    Token public token;
    uint public rate = 15470;

    event TokensPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    
    event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {  
        // #payable allows us to send ether when we call this function
        //Redemption rate = # of tokens they receive for 1 ether      e.g 1 Eth = 15470 TFB
     
        //Amount of Ethereum * Redemption rate
        uint tokenAmount = msg.value * rate;    //msg.value , amount of ether
        //require that EthSwap has enough tokens
        require(token.balanceOf(address(this)) >= tokenAmount);
        //transfer tokens to the user
        token.transfer(msg.sender, tokenAmount);

        //Emit an event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public {
        //User can't sell more tokens than they have
        require(token.balanceOf(msg.sender) >= _amount);

        //Calculate the amount of ether to redeem
        uint etherAmount = _amount / rate;

        //Require that EthSwap has enough Ether
        require(address(this).balance >= etherAmount);

        // Perfom sale
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

        //Emit an event
        emit TokensSold(msg.sender, address(token), _amount, rate);

    }
}
