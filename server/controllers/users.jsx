const db = require("../config/connect.jsx");

exports.listUsers = async (req, res) => {
    try {
        const query = 'SELECT user_id, username, email, role, enabled, first_name, last_name, updated_at FROM users';

        db.query(query, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server Error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "No users found" });
            }

            return res.json(results);
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.changeStatus = async (req, res) => {
    try {
        const { id, enabled } = req.body;
        const query = 'UPDATE users SET enabled = ? WHERE user_id = ?';
        db.query(query, [enabled, id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server Error" });
            }
            res.send("Update Status Success");
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.changeRole = async (req, res) => {
    try {
        const { id, role } = req.body;
        const query = 'UPDATE users SET role = ? WHERE user_id = ?';
        db.query(query, [role, id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server Error" });
            }
            res.send("Update Status Success");
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.userCart = async (req, res) => {
    try {
        const { cart } = req.body;
        console.log(req.params.id);
        const userId = req.params.id;
        const query = 'SELECT user_id, username, email, role, enabled FROM users WHERE user_id = ?';
        const carts = 'SELECT * FROM carts WHERE user_id = ?';
        const cartsUpdate = 'UPDATE carts SET cart_total = ? WHERE user_id = ?';
        const cartsAdd = 'INSERT INTO carts (user_id, cart_total) VALUES (?, ?)';
        const deleteProductcart = 'DELETE FROM product_on_cart WHERE cart_id = ?';

        db.query(query, [userId], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server Error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "No users found" });
            }

            db.query(carts, [userId], (err, resultscarts) => {
                if (err) return res.status(500).json({ message: "Server Error" });

                if (resultscarts.length > 0) {
                    db.query(cartsUpdate, [0, userId], (err, resultscartsUpdate) => {
                        if (err) return res.status(500).json({ message: "Server Error" });
                    });
                }
                else {
                    db.query(cartsAdd, [userId, 0], (err, resultscartsAdd) => {
                        if (err) return res.status(500).json({ message: "Server Error" });
                    });
                }

                const cart_id = resultscarts[0].cart_id;

                db.query(deleteProductcart, [cart_id], (err, resultsdeleteProductcart) => {
                    if (err) return res.status(500).json({ message: "Server Error" });
                });

                // เตรียมสินค้า
                let products = cart.map((item) => ({
                    productId: item.product_id,
                    count: item.count,
                    price: item.price,
                }));

                // หาผลรวม
                let cartTotal = products.reduce(
                    (sum, item) => sum + item.price * item.count,
                    0
                );
                db.query(cartsUpdate, [cartTotal, userId], (err, resultscartsUpdate) => {
                    if (err) return res.status(500).json({ message: "Server Error" });
                });

                const cartItemsQuery = "INSERT INTO product_on_cart (cart_id, product_id, count, price) VALUES ?";

                let productValues = products.map((item) => [cart_id, item.productId, item.count, item.price]);


                // เพิ่มสินค้าลงในตาราง cart_items
                db.query(cartItemsQuery, [productValues], (err, result) => {
                    if (err) return res.status(500).json({ message: "Error adding items to cart" });
                    return res.json({ message: "Cart updated successfully" });
                });
            });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};


exports.getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `SELECT 
                        products.product_id, 
                        products.name, 
                        products.price, 
                        product_on_cart.count,
                        carts.cart_total
                    FROM carts
                    JOIN product_on_cart ON product_on_cart.cart_id = carts.cart_id
                    JOIN products ON product_on_cart.product_id = products.product_id
                    WHERE carts.user_id = ?`;

        db.query(query, [userId], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server Error" });
            }

            if (results.length === 0) {
                return res.json({ message: "Cart is empty", products: [], cartTotal: 0 });
            }

            // ดึง cart_total จากแถวแรก (เพราะทุกแถวมีค่า cart_total เหมือนกัน)
            const cartTotal = results[0].cart_total;

            // จัดโครงสร้างข้อมูลสินค้า
            const products = results.map(item => ({
                productId: item.product_id,
                name: item.name,
                price: item.price,
                count: item.count
            }));

            res.json({ products, cartTotal });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.emptyCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const carts = 'SELECT * FROM carts WHERE user_id = ?';
        const cartsUpdate = 'UPDATE carts SET cart_total = ? WHERE user_id = ?';
        const deleteProductcart = 'DELETE FROM product_on_cart WHERE cart_id = ?';
        db.query(carts, [userId], (err, resultscarts) => {
            if (err) return res.status(500).json({ message: "Server Error" });

            if (resultscarts.length > 0) {
                db.query(cartsUpdate, [0, userId], (err, resultscartsUpdate) => {
                    if (err) return res.status(500).json({ message: "Server Error" });
                });
            } else {
                return res.status(400).json({ message: "No cart" });
            }

            const cart_id = resultscarts[0].cart_id;

            db.query(deleteProductcart, [cart_id], (err, resultsdeleteProductcart) => {
                if (err) return res.status(500).json({ message: "Server Error" });
            });

            res.json({ message: "Cart is empty" });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.saveAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            address,
            subdistrict,
            district,
            province,
            postal_code
        } = req.body;

        const query = `
            INSERT INTO addresses (user_id, address, subdistrict, district, province, postal_code)
            VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(query, [userId, address, subdistrict, district, province, postal_code], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            res.json({ message: "Address added successfully" });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getAddress = async (req, res) => {
    try {
        const userId = req.user.id;

        const query = 'SELECT * FROM addresses WHERE user_id = ? AND is_default = 1';

        db.query(query, [userId], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (!result || result.length === 0) {
                return res.status(404).json({ message: "No addresses found" });
            }

            res.json(result);
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};


exports.saveOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        const orderData = req.body.selectedAddress;

        const query = 'SELECT user_id, username, email, role, enabled FROM users WHERE user_id = ?';
        const carts = `SELECT 
                            products.product_id, 
                            products.name, 
                            products.price, 
                            product_on_cart.count,
                            carts.cart_total,
                            carts.cart_id
                        FROM carts
                        JOIN product_on_cart ON product_on_cart.cart_id = carts.cart_id
                        JOIN products ON product_on_cart.product_id = products.product_id
                        WHERE carts.user_id = ?`;

        const ordersAdd = 'INSERT INTO orders (user_id, cart_total, address_id) VALUES (?, ?, ?)';
        const cartsUpdate = 'UPDATE carts SET cart_total = ? WHERE user_id = ?';
        const checkProduct = 'SELECT * FROM products WHERE product_id = ?';
        const productUpdate = 'UPDATE products SET quantity = ?, sold = ? WHERE product_id = ?';
        const deleteProductcart = 'DELETE FROM product_on_cart WHERE cart_id = ? and product_id = ?';

        db.query(query, [userId], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server Error 1" }); // Return here to prevent further execution
            }

            db.query(carts, [userId], (err, resultscarts) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: "Server Error 2" });
                }

                const cartTotal = resultscarts[0].cart_total;
                const cartId = resultscarts[0].cart_id;

                const products = resultscarts.map(item => ({
                    productId: item.product_id,
                    name: item.name,
                    price: item.price,
                    count: item.count
                }));

                let count = 0;
                let ms = "";
                const promises = resultscarts.map(item => {
                    return new Promise((resolve, reject) => {
                        db.query(checkProduct, [item.product_id], (err, resultcheckProductValues) => {
                            if (err) return reject(err);

                            const resultcheckProduct = resultcheckProductValues[0];

                            if (!resultcheckProduct || resultcheckProduct.quantity < item.count) {
                                count++;
                                ms += `${resultcheckProduct ? resultcheckProduct.name : "ไม่พบสินค้า"} `;
                            }

                            resolve();
                        });
                    });
                });

                Promise.all(promises)
                    .then(() => {
                        if (count > 0) {
                            return res.status(400).json({ message: `ขออภัย สินค้า ${ms.trim()} หมด` }); // Return here to prevent further execution
                        }

                        db.query(ordersAdd, [userId, cartTotal, orderData], (err, resultsordersAdd) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ message: "Server Error" }); // Return here to prevent further execution
                            }

                            const order_id = resultsordersAdd.insertId;

                            db.query(cartsUpdate, [0, userId], (err) => {
                                if (err) return res.status(500).json({ message: "Server Error 3" });
                            });

                            let productUpdatePromises = products.map((item) => {
                                return new Promise((resolve, reject) => {
                                    db.query(checkProduct, [item.productId], (err, resultscheckProduct) => {
                                        if (err) return reject(err);

                                        const product_id = resultscheckProduct[0];

                                        db.query(productUpdate, [product_id.quantity - item.count, product_id.sold + item.count, item.productId], (err) => {
                                            if (err) return reject(err);
                                            resolve();
                                        });
                                    });
                                });
                            });

                            Promise.all(productUpdatePromises).then(() => {
                                let productcart = products.map((item) => [cartId, item.productId]);

                                productcart.forEach(([cartId, productId]) => {
                                    db.query(deleteProductcart, [cartId, productId], (err) => {
                                        if (err) return res.status(500).json({ message: "Server Error" });
                                    });
                                });

                                let productValues = products.map((item) => [order_id, item.productId, item.count, item.price]);

                                const orderItemsQuery = "INSERT INTO product_on_order (order_id, product_id, count, price) VALUES ?";
                                db.query(orderItemsQuery, [productValues], (err) => {
                                    if (err) return res.status(500).json({ message: "Error adding items to order" });

                                    return res.json({ message: "Order updated successfully" }); // Return here to prevent further execution
                                });
                            }).catch(err => {
                                if (!res.headersSent) { // Prevent error if headers were already sent
                                    return res.status(500).json({ message: "Error updating products" });
                                }
                            });
                        });
                    })
                    .catch(err => {
                        if (!res.headersSent) { // Prevent error if headers were already sent
                            return res.status(500).json({ message: "Server Error" });
                        }
                    });
            });
        });


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }

};

exports.getOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`;

        db.query(query, [userId], async (err, orders) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server Error" });
            }

            if (orders.length === 0) {
                return res.json({ message: "Order is empty" });
            }

            // ดึงสินค้าของแต่ละคำสั่งซื้อ
            const ordersWithProducts = await Promise.all(
                orders.map(async (order) => {
                    return new Promise((resolve, reject) => {
                        const productQuery = `
                            SELECT po.product_id, p.name, p.price, po.count 
                            FROM product_on_order po
                            JOIN products p ON po.product_id = p.product_id
                            WHERE po.order_id = ?
                        `;

                        db.query(productQuery, [order.order_id], (err, products) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({
                                    order_id: order.order_id,
                                    user_id: order.user_id,
                                    cart_total: order.cart_total,
                                    order_status: order.order_status,
                                    created_at: order.created_at,
                                    products: products // ใส่สินค้าลงไป
                                });
                            }
                        });
                    });
                })
            );

            res.json({ orders: ordersWithProducts });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.readUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = 'SELECT * FROM users WHERE user_id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            }
            res.send(results);
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { email, first_name, last_name, phone_number } = req.body;

        const query = `
            UPDATE users 
            SET 
                email = ?, 
                first_name = ?, 
                last_name = ?, 
                phone_number = ? 
            WHERE 
                user_id = ?;
        `;

        db.query(query, [email, first_name, last_name, phone_number, userId], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            }
            res.send({ message: "User updated successfully" });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.readAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const query = 'SELECT * FROM addresses WHERE user_id = ? AND address_id = ?';

        db.query(query, [userId, id], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (!result || result.length === 0) {
                return res.status(404).json({ message: "No addresses found" });
            }

            res.json(result);
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { address, subdistrict, district, province, postal_code } = req.body;
        const query = 'UPDATE addresses SET address = ?,subdistrict = ?,district = ?,province = ?,postal_code = ? WHERE user_id = ? AND address_id = ?';
        db.query(query, [address, subdistrict, district, province, postal_code, userId, id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            }
            res.send({ message: "Address updated successfully" });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const query = 'UPDATE addresses SET is_default = 0 WHERE user_id = ? AND address_id = ?';
        db.query(query, [userId, id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            }
            res.send({ message: "Adderss delete successfully" });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

