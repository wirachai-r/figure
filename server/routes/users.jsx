const express = require('express')
const router = express.Router()

const {
    listUsers,
    changeStatus,
    changeRole,
    readUser,
    updateUser,
    userCart,
    getUserCart,
    emptyCart,
    saveAddress,
    getAddress,
    readAddress,
    updateAddress,
    deleteAddress,
    saveOrder,
    getOrder
} = require('../controllers/users.jsx')
const { authCheck, adminCheck } = require('../middlewares/authCheck.jsx')


router.get('/users', authCheck, adminCheck, listUsers)
router.post('/change-status', authCheck, adminCheck, changeStatus)
router.post('/change-role', authCheck, adminCheck, changeRole)

router.get('/user', authCheck, readUser)///
router.put('/user', authCheck, updateUser)///

router.post('/user/cart/:id', authCheck, userCart)
router.get('/user/cart', authCheck, getUserCart)
router.delete('/user/cart', authCheck, emptyCart)

router.post('/user/address', authCheck, saveAddress)
router.get('/user/address', authCheck, getAddress)
router.get('/user/address/:id', authCheck, readAddress)///
router.put('/user/address/:id', authCheck, updateAddress)///
router.put('/user/addresses/:id', authCheck, deleteAddress)///

router.post('/user/order', authCheck, saveOrder)
router.get('/user/order', authCheck, getOrder)

module.exports = router