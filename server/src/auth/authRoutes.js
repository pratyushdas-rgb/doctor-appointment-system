const express = require('express');
const router = express.Router();
const authController = require('./authController');
const authenticateToken = require('../middleware/authMiddleware');  
const authorizeRoles = require('../middleware/roleMiddleware');  

router.post('/register', authController.register); 
router.post('/login' , authController.login); 


module.exports = router;
