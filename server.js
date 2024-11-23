require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const studentRoutes = require('./routes/studentRoutes');

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/students', studentRoutes)

app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})



