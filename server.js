require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload')

//Routes
const studentRoutes = require('./routes/studentRoutes');
const historyRoutes = require('./routes/historyRoutes');
const latestaqRoutes = require('./routes/latestaqRoutes');
const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes');
const aqReadingRoutes = require('./routes/aqReadingRoutes');
const emailRoutes = require('./routes/emailRoutes');
const protoespRoutes = require('./routes/protoespRoutes');
const chatRoutes = require('./routes/chatRoutes');
const expoTokenRoutes = require('./routes/expoTokenRoutes');
const aqChartRoutes = require('./routes/aqChartRoutes');
const excelRoutes = require('./routes/excelRoutes');


app.use(cors());
app.use(express.json());
app.use(fileUpload({createParentPath: true,}));

require('./services/cronJob');

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
app.use('/esp', protoespRoutes)
app.use('/chat', chatRoutes)
app.use('/expoToken', expoTokenRoutes)
app.use('/aqChart', aqChartRoutes)
app.use('/excel', excelRoutes)

app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})



