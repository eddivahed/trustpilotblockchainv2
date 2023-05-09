require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/users');
const businessRoutes = require('./routes/businesses');


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

app.use('/api/users', userRoutes);
app.use('/api/businesses', businessRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
