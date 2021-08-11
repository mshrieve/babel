// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import './Babel.sol';
import './Libraries/Math.sol';

// bonding curve contract
//

// bonding curve works  by taking time weighted volume
// i.e. let q_i be the number of purchases in the i-th block
// then cost function is C(q) = exp(a \sum q_i / n^i)
// then each new block we mult by 1/n and exponentiate
// need a 'floor' price, probably
// don't need a max but a, and n will determine how quickly the curve goes up or down.

contract Curve {
    Babel immutable babel;

    uint256 public blockLastUpdated;
    uint256 public weight;
    uint256 public alpha = 152003093445049984; // -log_2(90%)
    uint256 public gamma = 1000000000000000; // .0001
    uint256 public floor = 100000000000000; // .001

    event BabelMinted(address to, uint256 amount);

    constructor(address _babel) {
        babel = Babel(_babel);
    }

    function purchase(uint256 amount) external payable {
        uint256 blocksSinceLastUpdated = block.number - blockLastUpdated;
        // update Q if it has been more than one block since the last update
        if (blocksSinceLastUpdated > 0) {
            blockLastUpdated = block.number;
            // if > 1684 we overflow the exponent
            if (blocksSinceLastUpdated < 1684) {
                weight =
                    (weight * 10**18) /
                    Math.exponentiate(alpha * blocksSinceLastUpdated);
            }
            // otherwise add nothing
        }
        // C(Q + q) - C(Q)
        // path-independent within block
        uint256 price = floor +
            costFunction(weight + amount) -
            costFunction(weight);
        weight += amount;

        // check for eth transfer
        require(msg.value >= price, 'Bank: not enough eth sent');
        uint256 surplus = msg.value - price;
        babel.mint(msg.sender, amount);
        payable(msg.sender).transfer(surplus);
    }

    function getPrice(uint256 amount) external view returns (uint256 price) {
        uint256 blocksSinceLastUpdated = block.number - blockLastUpdated;
        uint256 weight_;
        // update Q if it has been more than one block since the last update
        if (blocksSinceLastUpdated > 0) {
            // if > 1684 we overflow the exponent
            if (blocksSinceLastUpdated < 1684)
                weight_ =
                    (weight * 10**18) /
                    Math.exponentiate(alpha * blocksSinceLastUpdated);
        } else weight_ = weight;
        // C(Q + q) - C(Q)
        // path-independent within block
        price = floor + costFunction(weight_ + amount) - costFunction(weight_);
    }

    function costFunction(uint256 volume) internal view returns (uint256) {
        return Math.exponentiate((gamma * volume) / 10**18);
    }
}
