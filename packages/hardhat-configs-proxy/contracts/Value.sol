// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Value is Initializable {

    event ValueChanged(uint256 oldValue, uint256 newValue);

    uint256 public value;

    function initialize(uint256 _value) public initializer {
        value = _value;
    }

    function updateValue(uint256 newValue) external {
        uint256 oldValue = value;
        value = newValue;
        emit ValueChanged(oldValue, value);
    }

}
