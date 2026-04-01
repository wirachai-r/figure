// import ....
const express = require('express')
const router = express.Router()
// import controller
const { create, list, update, remove } = require('../controllers/categories.jsx')
const { authCheck, adminCheck } = require('../middlewares/authCheck.jsx')

router.post('/categories', authCheck, adminCheck, create)
router.get('/categories', list)
router.put('/categories/:id', authCheck, adminCheck, update)
router.delete('/categories/:id', authCheck, adminCheck, remove)

module.exports = router