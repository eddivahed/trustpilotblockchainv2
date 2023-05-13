const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Review = require('../models/Review');
const User = require('../models/User');
const Business = require('../models/Business');
const { submitReview, getReview } = require('../services/ethereum');

router.post('/submit', auth, async (req, res) => {
    try {
      const { businessId, rating, comment } = req.body;
      const user = await User.findById(req.user.id).select('+privateKey');
  
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      const business = await Business.findById(businessId);
  
      if (!business) {
        return res.status(400).json({ error: 'Business not found' });
      }
  
      const transactionHash = await submitReview(
        user.walletAddress, 
        user.privateKey, 
        business.walletAddress, 
        rating, 
        comment
      );
      
  
      const newReview = new Review({
        user: req.user.id,
        business: businessId,
        rating,
        comment,
        transactionHash
      });
  
      await newReview.save();
      res.status(201).json(newReview);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.get('/business/:businessId', async (req, res) => {
    try {
      const businessId = req.params.businessId;
      const business = await Business.findById(businessId);
  
      if (!business) {
        return res.status(400).json({ error: 'Business not found' });
      }
  
      const reviews = await Review.find({ business: businessId });
      for (let review of reviews) {
        const reviewData = await getReview(review.transactionHash);
        review.author = reviewData.author;
        review.business = reviewData.business;
        review.rating = reviewData.rating;
        review.comment = reviewData.comment;
      }
      
      res.status(200).json(reviews);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

module.exports = router;
