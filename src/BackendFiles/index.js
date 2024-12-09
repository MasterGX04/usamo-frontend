import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import database from './database';
import dotenv from 'dotenv';

const app = express();
const PORT = 3000;

const JWT_SECRET = process.env.JWT_SECRET;

app.use(bodyParser.json());

//Signup route
app.post('/signup', (req, res) => {
    const { username, password, email } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: "Error hashing password" });

        const sqlStatement = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
        database.query(sqlStatement, [username, hashedPassword, email], (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(201).json({ message: `User with username ${username} was created successfully` });
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sqlStatement = 'SELECT * FROM users WHERE username = ?';
    database.query(sqlStatement, [username], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: 'Error comparing passwords' });
            if (!isMatch) return res.status(401).json({ error: 'Incorrect password' });

            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '2d' });
            res.json({ message: 'Login successful', token });
        });
    });
});