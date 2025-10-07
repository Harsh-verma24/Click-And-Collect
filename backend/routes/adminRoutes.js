const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')

// POST /api/admin/login
router.post('/login', adminController.login)

// GET /api/admin/status
router.get('/status', adminController.status)

module.exports = router
