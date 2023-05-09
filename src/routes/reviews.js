const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Review = require('../models/Review');
const User = require('../models/User');
const Business = require('../models/Business');

router.post('/submit', auth, async (req, res) => {
    try {
      const { businessId, rating, comment } = req.body;
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      const business = await Business.findById(businessId);
  
      if (!business) {
        return res.status(400).json({ error: 'Business not found' });
      }
  
      const newReview = new Review({
        user: req.user.id,
        business: businessId,
        rating,
        comment
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
      res.status(200).json(reviews);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});
  


  




module.exports = router;
