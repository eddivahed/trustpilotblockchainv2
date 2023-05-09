const authMiddleware = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const Review = require('../models/Review');

// Add the routes here

module.exports = router;



// ... (other imports and route setup)

// Register a new business
router.post('/register', authMiddleware, async (req, res) => {
  try {
    const { name, description, walletAddress } = req.body;
    const existingBusiness = await Business.findOne({ walletAddress });

    if (existingBusiness) {
      return res.status(400).json({ error: 'Business already exists' });
    }

    const newBusiness = new Business({ name, description, walletAddress, owner: req.user.id });
    await newBusiness.save();

    res.status(201).json(newBusiness);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update a business
router.put('/update/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    if (business.owner.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (name) business.name = name;
    if (description) business.description = description;

    await business.save();

    res.status(200).json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Fetch reviews for a business
router.get('/reviews/:id', async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const reviews = await Review.find({ business: business._id });

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Submit a review for a business
router.post('/:id/reviews', authMiddleware, async (req, res) => {
  // ... (route logic)
});

module.exports = router;

