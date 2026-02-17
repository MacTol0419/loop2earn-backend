const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../utils/db');
require('dotenv').config();

// SIGNUP
const signup = async (req, res) => {
  const { username, password } = req.body;

  console.log('====================================');
  console.log(username, password);
  console.log('====================================');
  try {
    // Check if username exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username=$1',
      [username]
    );
    if (existingUser.rows.length > 0)
      return res.status(400).json({ message: 'Username already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.rows[0].id, username: newUser.rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: newUser.rows[0],
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE username=$1', [
      username
    ]);
    if (user.rows.length === 0)
      return res.status(400).json({ message: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isValid)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.rows[0].id, username: user.rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.rows[0].id, username },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PROTECTED ROUTE EXAMPLE
const getProfile = async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, username, created_at FROM users WHERE id=$1',
      [req.user.id]
    );
    res.status(200).json({ user: user.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, login, getProfile };
