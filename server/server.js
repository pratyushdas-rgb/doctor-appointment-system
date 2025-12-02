const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./src/config/db');
const authRoutes = require('./src/auth/authRoutes'); 
const availabilityRoutes = require('./src/doctor/availability/availabilityRoutes');
const authenticateToken = require('./src/middleware/authMiddleware');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());  
app.use(cors());  

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api',authenticateToken,availabilityRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
