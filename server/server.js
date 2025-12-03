const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./src/config/db');
const authRoutes = require('./src/auth/authRoutes'); 
const availabilityRoutes = require('./src/doctor/availability/availabilityRoutes');
const profileRoutes = require('./src/doctor/profile/doctorRoutes')
const authenticateToken = require('./src/middleware/authMiddleware');
const referenceRoutes = require('./src/reference/referenceRoutes');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());  
app.use(cors());  

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api',authenticateToken,availabilityRoutes);
app.use('/api',authenticateToken,profileRoutes)
app.use('/api', referenceRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
