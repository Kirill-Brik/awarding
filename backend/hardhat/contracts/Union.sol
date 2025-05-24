// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Union is Ownable {

    struct UnionUser {
        // uint256 union_id;
        uint256 initiator_id;
        uint256 user_id;
        string union_type;
    }

    uint256 public count = 0;
    // UnionUser[] private unions;
    mapping (uint256 => UnionUser) unions;

    constructor()
    Ownable(msg.sender){}

    function addUnion(uint256 _union_id, uint256 _initiator_id, uint256 _user_id, string memory _union_type) public onlyOwner {
        UnionUser memory union;
        // union.union_id = _union_id;
        union.initiator_id = _initiator_id;
        union.user_id = _user_id;
        union.union_type = _union_type;
        unions[_union_id] = union;
        count++;
    }

    function getUnionById(uint256 _union_id) public view returns (UnionUser memory) {
        return unions[_union_id];
    }

}
