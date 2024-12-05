require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const studentRoutes = require('./routes/studentRoutes');
const historyRoutes = require('./routes/historyRoutes');
const latestaqRoutes = require('./routes/latestaqRoutes');
const authRoutes = require('./routes/authRoutes');


app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/students', studentRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/latestaq', latestaqRoutes)
app.use('/api/auth', authRoutes)

app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})



