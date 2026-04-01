const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

        cb(null, "Product-" + Date.now() + file.originalname);
    }
});

// ใช้ .array('images') เนื่องจากต้องการอัปโหลดหลายไฟล์
exports.upload = multer({ storage: storage }).array('images', 5);  // 'images' ชื่อต้องตรงกับที่ใช้ใน client