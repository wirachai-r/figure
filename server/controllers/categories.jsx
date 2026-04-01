const db = require("../config/connect.jsx");

exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        const query = 'INSERT INTO categories (name) VALUES (?)';
        db.query(query, [name], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            }
            res.send({ id: result.insertId, name });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.list = async (req, res) => {
    try {
        const query = 'SELECT * FROM categories';
        db.query(query, (err, results) => {
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

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        console.log(name)
        const query = 'UPDATE categories SET name = ? WHERE category_id = ?';
        db.query(query, [name, id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            }
            res.send({ message: "Category updated successfully" });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM categories WHERE category_id = ?';
        db.query(query, [id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Server error" });
            }
            res.send({ message: "Category deleted successfully" });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};