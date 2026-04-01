const db = require("../config/connect.jsx");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    try {
        const { username, email, password, first_name, last_name, phone_number } = req.body;
        const cartsAdd = 'INSERT INTO carts (user_id, cart_total) VALUES (?, ?)';

        // Step 1: Validate body
        if (!username) return res.status(400).json({ message: 'Username is required!!!' });
        if (!email) return res.status(400).json({ message: 'Email is required!!!' });
        if (!password) return res.status(400).json({ message: 'Password is required!!!' });
        if (!first_name) return res.status(400).json({ message: 'First name is required!!!' });
        if (!last_name) return res.status(400).json({ message: 'Last name is required!!!' });
        if (!phone_number) return res.status(400).json({ message: 'Phone number is required!!!' });

        // Step 2: Check if Username OR Email already exists
        db.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], async (err, result) => {
            if (err) return res.status(500).json({ message: "Database error" });

            if (result.length > 0) {
                const existingUser = result[0];
                if (existingUser.username === username) {
                    return res.status(400).json({ message: "Username already exists!!" });
                }
                if (existingUser.email === email) {
                    return res.status(400).json({ message: "Email already exists!!" });
                }
            }

            // Step 3: Hash Password
            const hashPassword = await bcrypt.hash(password, 10);

            // Step 4: Register User
            db.query(
                "INSERT INTO users (username, email, password_hash, first_name, last_name, phone_number) VALUES (?, ?, ?, ?, ?, ?)",
                [username, email, hashPassword, first_name, last_name, phone_number],
                (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ message: "Error while registering user" });
                    }

                    const userId = result.insertId; // Get the newly inserted user ID

                    // Step 5: Create a Cart for the New User
                    db.query(cartsAdd, [userId, 0], (err, resultscartsAdd) => {
                        if (err) return res.status(500).json({ message: "Error creating cart" });

                        return res.json({ message: 'Register Success' });
                    });
                }
            );
        });

    } catch (err) {
        // err
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Step 1 Validate body
        if (!username) {
            return res.status(400).json({ message: 'Username is required!!!' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is required!!!' });
        }

        // Step 2 Check Username in DB
        db.query("SELECT * FROM users WHERE username = ? or email = ?", [username, username], async (err, result) => {
            if (err) return res.status(500).json({ message: "Database error" });

            if (result.length === 0) {
                return res.status(400).json({ message: "User not found or not enabled" });
            }

            const user = result[0];

            if (!user || !user.enabled) {
                return res.status(400).json({ message: 'User Not found or not Enabled' })
            }

            // Step 3 Check password
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.status(400).json({ message: 'Password Invalid!!!' });
            }

            // Step 4 Create Payload
            const payload = {
                id: user.user_id,
                username: user.username,
                role: user.role
            };

            // Step 5 Generate Token
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
                if (err) {
                    return res.status(500).json({ message: "Server Error" });
                }
                res.json({ payload, token });
            });
        });
    } catch (err) {
        // err
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.currentUser = async (req, res) => {
    try {
        const username = req.user.username;
        const query = 'SELECT user_id, username, email, first_name, last_name, phone_number, role FROM users WHERE username = ?';
        db.query(query, [username], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            }
            res.send(results);
        });
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}