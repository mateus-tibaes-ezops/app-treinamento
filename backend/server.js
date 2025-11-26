const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'training_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize database and create table if it doesn't exist
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        
        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'training_app'}`);
        await connection.query(`USE ${process.env.DB_NAME || 'training_app'}`);
        
        // Create table if it doesn't exist
        await connection.query(`
            CREATE TABLE IF NOT EXISTS records (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        
        connection.release();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

// API Routes

// GET all records
app.get('/api/records', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM records ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Failed to fetch records' });
    }
});

// GET single record by ID
app.get('/api/records/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM records WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching record:', error);
        res.status(500).json({ error: 'Failed to fetch record' });
    }
});

// POST create new record
app.post('/api/records', async (req, res) => {
    try {
        const { name, email, description } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        
        const [result] = await pool.query(
            'INSERT INTO records (name, email, description) VALUES (?, ?, ?)',
            [name, email, description || null]
        );
        
        const [newRecord] = await pool.query('SELECT * FROM records WHERE id = ?', [result.insertId]);
        res.status(201).json(newRecord[0]);
    } catch (error) {
        console.error('Error creating record:', error);
        res.status(500).json({ error: 'Failed to create record' });
    }
});

// PUT update record
app.put('/api/records/:id', async (req, res) => {
    try {
        const { name, email, description } = req.body;
        const { id } = req.params;
        
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        
        const [result] = await pool.query(
            'UPDATE records SET name = ?, email = ?, description = ? WHERE id = ?',
            [name, email, description || null, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }
        
        const [updatedRecord] = await pool.query('SELECT * FROM records WHERE id = ?', [id]);
        res.json(updatedRecord[0]);
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ error: 'Failed to update record' });
    }
});

// DELETE record
app.delete('/api/records/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await pool.query('DELETE FROM records WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }
        
        res.json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ error: 'Failed to delete record' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
async function startServer() {
    await initializeDatabase();
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on http://0.0.0.0:${PORT}`);
        console.log(`API endpoints available at http://0.0.0.0:${PORT}/api`);
    });
}

startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

