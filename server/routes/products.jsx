// import ....
const express = require('express')
const router = express.Router()
// import controller
const {
    create,
    list,
    read,
    update,
    remove,
    listby,
    searchFilters,
    createImages,
    removeImage
} = require('../controllers/products.jsx')
const { upload } = require('../middlewares/upload.jsx')
const { authCheck, adminCheck } = require('../middlewares/authCheck.jsx')

router.post('/product', upload, create)
router.get('/products', list)
// router.get('/products/:count', list)
router.get('/product/:id', read)
router.put('/product/:id', update)
router.delete('/product/:id', remove)
router.post('/productby', listby)
router.post('/search/filters', searchFilters)

router.post('/images/:id', authCheck, adminCheck, upload, createImages)
router.post('/removeimages/:id', authCheck, adminCheck, removeImage)

module.exports = router