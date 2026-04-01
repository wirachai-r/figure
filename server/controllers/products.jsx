const db = require("../config/connect.jsx");
const fs = require('fs');

exports.create = async (req, res) => {
    try {
        const { name, description, price, quantity, manufacturer, series, character_name, scale, release_date, category_id } = req.body;
        const query = `
            INSERT INTO products (name, description, price, quantity, manufacturer, series, character_name, scale, release_date, category_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(query, [name, description, price, quantity, manufacturer, series, character_name, scale, release_date, category_id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            }

            // ส่งคำตอบไปยัง client
            res.send({ id: result.insertId, name, description, price, quantity, manufacturer, series, character_name, scale, release_date, category_id });

            const product = result.insertId;

            // ตรวจสอบว่ามีไฟล์ที่ถูกอัปโหลดหรือไม่
            if (req.files && req.files.length > 0) {
                const cartImageQuery = "INSERT INTO product_images (product_id , image_name) VALUES ?";
                let product_image = req.files.map((item) => [product, item.filename]);

                // เพิ่มรูปภาพลงในตาราง product_images
                db.query(cartImageQuery, [product_image], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ message: "Error adding image to product" });
                    }
                    // หากการอัปโหลดรูปภาพสำเร็จ สามารถตอบกลับได้ที่นี่
                    console.log("Images added to product successfully");
                });
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.list = async (req, res) => {
    try {
        const { count } = req.params;
        // const limit = parseInt(count, 10);

        const query = `
                        SELECT 
                            p.product_id, p.name, p.description, p.price, p.quantity, p.sold, p.manufacturer, p.updated_at,
                            p.series, p.character_name, p.scale, p.release_date, p.created_at AS product_created_at, 
                            GROUP_CONCAT(
                                JSON_OBJECT(
                                    'image_id', pi.image_id,
                                    'image_name', pi.image_name,
                                    'is_primary', pi.is_primary,
                                    'image_created_at', pi.created_at
                                ) SEPARATOR ','
                            ) AS images
                        FROM products p
                        LEFT JOIN product_images pi ON p.product_id = pi.product_id
                        GROUP BY p.product_id
                        ORDER BY p.created_at DESC`;

        db.query(query, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            }

            // จัดการข้อมูลให้อยู่ในรูปแบบที่ต้องการ
            const formattedResults = results.map(result => {
                result.images = result.images ? JSON.parse("[" + result.images + "]") : [];
                return result;
            });

            res.json(formattedResults);  // ส่งผลลัพธ์ในรูปแบบ JSON
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.read = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
                        SELECT 
                            p.product_id, p.name, p.description, p.price, p.quantity, p.sold, p.manufacturer, p.updated_at,
                            p.series, p.character_name, p.scale, p.release_date, p.category_id, p.created_at AS product_created_at, 
                            GROUP_CONCAT(
                                JSON_OBJECT(
                                    'image_id', pi.image_id,
                                    'image_name', pi.image_name,
                                    'is_primary', pi.is_primary,
                                    'image_created_at', pi.created_at
                                ) SEPARATOR ',' 
                            ) AS images
                        FROM products p
                        LEFT JOIN product_images pi ON p.product_id = pi.product_id
                        WHERE p.product_id = ?`;

        db.query(query, [id], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            }

            // Process the results to convert the images field into an array
            const formattedResults = results.map(result => {
                result.images = result.images ? JSON.parse("[" + result.images + "]") : [];
                return result;
            });

            res.json(formattedResults);  // Send the results in JSON format
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const { name, description, price, quantity, manufacturer, series, character_name, scale, category_id } = req.body;
        const query = `
            UPDATE products
            SET name = ?, description = ?, price = ?, quantity = ?, manufacturer = ?, series = ?, character_name = ?, scale = ?, category_id = ?
            WHERE product_id = ?
        `;
        db.query(query, [name, description, price, quantity, manufacturer, series, character_name, scale, category_id, id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            }
            res.send({ message: "Product updated successfully" });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const sqlQuery = `SELECT * FROM product_images WHERE product_id IN (?)`;
        db.query(sqlQuery, [id], async (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server Error" });
            }

            console.log(results); // ตรวจสอบข้อมูลก่อน

            if (results.length > 0) {
                for (const image of results) {
                    await fs.unlink('./uploads/' + image.image_name, (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("DD");
                        }
                    });
                }
            }

            const queryproducts = 'DELETE FROM products WHERE product_id = ?';
            db.query(queryproducts, [id], (err, resultqueryproducts) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: "Server error" });
                }
                res.send({ message: "Product deleted successfully" });
            });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.listby = async (req, res) => {
    try {
        let { sort, order, limit } = req.body;

        // ป้องกัน SQL Injection โดยกำหนดค่าที่อนุญาตเท่านั้น
        const validSortColumns = ["p.sold", "p.price", "p.created_at"];
        const validOrder = ["ASC", "DESC"];

        // ตรวจสอบค่า sort และ order ถ้าไม่ถูกต้องให้ใช้ค่าเริ่มต้น
        sort = validSortColumns.includes(sort) ? sort : "p.created_at"; // ค่าเริ่มต้นคือ created_at
        order = validOrder.includes(order.toUpperCase()) ? order.toUpperCase() : "DESC"; // ค่าเริ่มต้นคือ DESC
        limit = parseInt(limit) || 12; // ค่าเริ่มต้นคือ 12

        const query = `
        SELECT 
            p.product_id, p.name, p.description, p.price, p.quantity, p.sold, p.manufacturer, p.updated_at,
            p.series, p.character_name, p.scale, p.release_date, p.created_at AS product_created_at, 
            GROUP_CONCAT(
                JSON_OBJECT(
                    'image_id', pi.image_id,
                    'image_name', pi.image_name,
                    'is_primary', pi.is_primary,
                    'image_created_at', pi.created_at
                ) SEPARATOR ','
            ) AS images
        FROM products p
        LEFT JOIN product_images pi ON p.product_id = pi.product_id
        GROUP BY p.product_id
        ORDER BY ${sort} ${order} 
        LIMIT ?`;

        db.query(query, [limit], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            }

            // จัดรูปแบบผลลัพธ์
            const formattedResults = results.map(result => {
                result.images = result.images ? JSON.parse("[" + result.images + "]") : [];
                return result;
            });

            res.json(formattedResults);
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

const handleQuery = async (req, res, query) => {
    try {
        const sqlQuery = `
            SELECT 
                p.product_id, p.name, p.description, p.price, p.quantity, p.sold, p.manufacturer, p.updated_at,
                p.series, p.character_name, p.scale, p.release_date, p.created_at AS product_created_at, 
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'image_id', pi.image_id,
                        'image_name', pi.image_name,
                        'is_primary', pi.is_primary,
                        'image_created_at', pi.created_at
                    ) SEPARATOR ',' 
                ) AS images
            FROM products p
            LEFT JOIN product_images pi ON p.product_id = pi.product_id
            WHERE p.name LIKE ?
            GROUP BY p.product_id
            ORDER BY p.created_at DESC
        `;

        db.query(sqlQuery, [`%${query}%`], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Search Error" });
            }

            // จัดการข้อมูลให้อยู่ในรูปแบบที่ต้องการ
            const formattedResults = results.map(result => {
                result.images = result.images ? JSON.parse("[" + result.images + "]") : [];  // แปลง JSON string เป็น array
                return result;
            });

            res.json(formattedResults);  // ส่งผลลัพธ์ในรูปแบบ JSON
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Search Error" });
    }

};

const handleCategory = async (req, res, categoryId) => {
    try {
        const sqlQuery = `
            SELECT 
                p.product_id, p.name, p.description, p.price, p.quantity, p.sold, p.manufacturer, p.updated_at,
                p.series, p.character_name, p.scale, p.release_date, p.created_at AS product_created_at, 
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'image_id', pi.image_id,
                        'image_name', pi.image_name,
                        'is_primary', pi.is_primary,
                        'image_created_at', pi.created_at
                    ) SEPARATOR ',' 
                ) AS images
            FROM products p
            LEFT JOIN product_images pi ON p.product_id = pi.product_id
            WHERE p.category_id IN (?)
            GROUP BY p.product_id
            ORDER BY p.created_at DESC
        `;

        db.query(sqlQuery, [categoryId], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Search Error" });
            }

            // จัดการข้อมูลให้อยู่ในรูปแบบที่ต้องการ
            const formattedResults = results.map(result => {
                result.images = result.images ? JSON.parse("[" + result.images + "]") : [];  // แปลง JSON string เป็น array
                return result;
            });

            res.json(formattedResults);  // ส่งผลลัพธ์ในรูปแบบ JSON
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

const handlePrice = async (req, res, priceRange) => {
    try {
        const sqlQuery = `
            SELECT 
                p.product_id, p.name, p.description, p.price, p.quantity, p.sold, p.manufacturer, p.updated_at,
                p.series, p.character_name, p.scale, p.release_date, p.created_at AS product_created_at, 
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'image_id', pi.image_id,
                        'image_name', pi.image_name,
                        'is_primary', pi.is_primary,
                        'image_created_at', pi.created_at
                    ) SEPARATOR ',' 
                ) AS images
            FROM products p
            LEFT JOIN product_images pi ON p.product_id = pi.product_id
            WHERE p.price BETWEEN ? AND ?
            GROUP BY p.product_id
            ORDER BY p.created_at DESC
        `;

        db.query(sqlQuery, [priceRange[0], priceRange[1]], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Search Error" });
            }

            // จัดการข้อมูลให้อยู่ในรูปแบบที่ต้องการ
            const formattedResults = results.map(result => {
                result.images = result.images ? JSON.parse("[" + result.images + "]") : [];  // แปลง JSON string เป็น array
                return result;
            });

            res.json(formattedResults);  // ส่งผลลัพธ์ในรูปแบบ JSON
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.searchFilters = async (req, res) => {
    try {
        const { query, category, price } = req.body;

        console.log(query);

        if (query) {
            console.log('query-->', query);
            await handleQuery(req, res, query);
        }
        if (category) {
            console.log('category-->', category);
            await handleCategory(req, res, category);
        }
        if (price) {
            console.log('price-->', price);
            await handlePrice(req, res, price);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.createImages = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.files);
        if (req.files && req.files.length > 0) {
            const cartImageQuery = "INSERT INTO product_images (product_id , image_name) VALUES ?";
            let product_image = req.files.map((item) => [id, item.filename]);

            // เพิ่มรูปภาพลงในตาราง product_images
            db.query(cartImageQuery, [product_image], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: "Error adding image to product" });
                }
                // หากการอัปโหลดรูปภาพสำเร็จ สามารถตอบกลับได้ที่นี่
                // res.send(result);

                // ดึงข้อมูลรูปภาพที่ถูกเพิ่มเข้าไป
                const insertedImages = req.files.map((file) => ({
                    product_id: id,
                    image_name: file.filename
                }));

                // ส่งค่ากลับไปยัง client
                res.json({
                    message: "Images uploaded successfully",
                    images: insertedImages // ส่งข้อมูลภาพที่เพิ่มกลับไป
                });
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.removeImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { imageName } = req.body; // ต้องใช้ req.body

        console.log("Product ID:", id);
        console.log("Image to Remove:", imageName);

        const query = 'DELETE FROM product_images WHERE product_id = ? and image_name = ?';
        db.query(query, [id, imageName], async (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            }
            await fs.unlink('./uploads/' + imageName, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("DD");
                }
            });
            res.send({ message: "Product deleted successfully" });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};