const db = require("../config/connect.jsx");
const jwt = require('jsonwebtoken');

exports.authCheck = async (req, res, next) => {
    try {
        const headerToken = req.headers.authorization;

        // console.log(headerToken)

        if (!headerToken) {
            return res.status(401).json({ message: "No Token, Authorization Denied" });
        }

        const token = headerToken.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;

        const query = 'SELECT * FROM users WHERE username = ?';
        db.query(query, [req.user.username], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            }

            const user = results[0];
            if (!user || !user.enabled) {
                return res.status(403).json({ message: 'This account cannot access' });
            }

            next();
        });

    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: 'Token Invalid' });
    }
};

exports.adminCheck = async (req, res, next) => {
    try {
        const { username } = req.user;
        const query = 'SELECT * FROM users WHERE username = ?';
        db.query(query, [username], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            }

            const adminUser = results[0];

            if (!adminUser || adminUser.role !== 'admin') {
                return res.status(403).json({ message: 'Access Denied: Admin Only' });
            }

            next();
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error Admin access denied' });
    }
};
