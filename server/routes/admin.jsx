// import ....
const express = require('express')
const { authCheck } = require('../middlewares/authCheck.jsx')
const router = express.Router()
// import controller
const { getOrderAdmin, changeOrderStatus } = require('../controllers/admin.jsx')

router.put('/admin/order-status', authCheck, changeOrderStatus)
router.get('/admin/orders', authCheck, getOrderAdmin)

module.exports = router