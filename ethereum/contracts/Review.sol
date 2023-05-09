// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Review is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _reviewIds;

    struct ReviewData {
        address author;
        address business;
        uint8 rating;
        string comment;
    }

    mapping (uint256 => address) private _reviewAuthors;
    mapping (uint256 => address) private _reviewBusinesses;
    mapping (uint256 => uint8) private _reviewRatings;
    mapping (uint256 => string) private _reviewComments;

    constructor() ERC721("ReviewToken", "REVT") {}

    function submitReview(address business, uint8 rating, string memory comment) public {
        _reviewIds.increment();
        uint256 newReviewId = _reviewIds.current();
        _mint(msg.sender, newReviewId);
        _reviewAuthors[newReviewId] = msg.sender;
        _reviewBusinesses[newReviewId] = business;
        _reviewRatings[newReviewId] = rating;
        _reviewComments[newReviewId] = comment;
    }

    function getReview(uint256 reviewId) public view returns (ReviewData memory) {
        require(_exists(reviewId), "Review does not exist");
        return ReviewData({
            author: _reviewAuthors[reviewId],
            business: _reviewBusinesses[reviewId],
            rating: _reviewRatings[reviewId],
            comment: _reviewComments[reviewId]
        });
    }
}
