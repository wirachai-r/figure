const db = require("../config/connect.jsx");

exports.changeOrderStatus = async (req, res) => {
    try {
        const { orderId, orderStatus } = req.body

        const query = 'UPDATE orders SET order_status = ? WHERE order_id = ?';
        db.query(query, [orderStatus, orderId], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            }
            res.send({ message: "Order updated successfully" });
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}
exports.getOrderAdmin = async (req, res) => {
    try {
        const query = `
    SELECT o.order_id, o.user_id, o.cart_total, o.order_status, o.created_at,o.address_id,
           u.username, u.email
    FROM orders o
    JOIN users u ON o.user_id = u.user_id
    ORDER BY o.created_at DESC
`;

        db.query(query, async (err, orders) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server Error" });
            }

            if (orders.length === 0) {
                return res.json({ message: "Order is empty" });
            }

            // ✅ ดึงสินค้าของแต่ละคำสั่งซื้อ พร้อมกับที่อยู่
            const ordersWithDetails = await Promise.all(
                orders.map(async (order) => {
                    return new Promise((resolve, reject) => {
                        const productQuery = `
                    SELECT po.product_id, p.name, po.price, po.count
                    FROM product_on_order po
                    JOIN products p ON po.product_id = p.product_id
                    WHERE po.order_id = ?
                `;

                        db.query(productQuery, [order.order_id], (err, products) => {
                            if (err) {
                                reject(err);
                            } else {
                                // ✅ ดึงข้อมูลที่อยู่ของผู้ใช้
                                const addressQuery = `
                            SELECT a.address_id, a.address, a.subdistrict, a.district, a.province, a.postal_code
                            FROM addresses a
                            WHERE a.address_id = ?
                        `;

                                db.query(addressQuery, [order.address_id], (err, addresses) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve({
                                            order_id: order.order_id,
                                            user: {
                                                id: order.user_id,
                                                username: order.username,
                                                email: order.email,
                                                addresses: addresses // ✅ ใส่ที่อยู่ของผู้ใช้
                                            },
                                            cart_total: order.cart_total,
                                            order_status: order.order_status,
                                            created_at: order.created_at,
                                            products: products // ✅ ใส่สินค้าลงไป
                                        });
                                    }
                                });
                            }
                        });
                    });
                })
            );

            res.json(ordersWithDetails);
        });

    } catch (err) {
        console.log(errr)
        res.status(500).json({ message: "Server error" })
    }
}