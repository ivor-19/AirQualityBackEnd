require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload')
const studentRoutes = require('./routes/studentRoutes');
const historyRoutes = require('./routes/historyRoutes');
const latestaqRoutes = require('./routes/latestaqRoutes');
const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes')
const aqReadingRoutes = require('./routes/aqReadingRoutes')
const emailRoutes = require('./routes/emailRoutes');


app.use(cors());
app.use(express.json());
app.use(fileUpload());

// console.log('JWT_SECRET:', process.env.JWT_SECRET);
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/students', studentRoutes)
app.use('/history', historyRoutes)
app.use('/latestaq', latestaqRoutes)
app.use('/users', authRoutes)
app.use('/assets', assetRoutes)
app.use('/aqReadings', aqReadingRoutes)
app.use('/email', emailRoutes)

app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})



