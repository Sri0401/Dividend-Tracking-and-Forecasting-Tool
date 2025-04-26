require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route to search for stocks from NSE and BSE
app.get('/api/search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const apiUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${query}`; // Yahoo Finance search endpoint

        const response = await axios.get(apiUrl);

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

// Route to fetch dividend data
app.get('/api/dividends', async (req, res) => {
    const { symbol } = req.query;

    if (!symbol) {
        return res.status(400).json({ error: 'Stock symbol is required' });
    }

    try {
        // Mock data for dividends
        const mockDividends = [
            { date: '2025-01-15', amount: 50 },
            { date: '2025-04-15', amount: 55 },
            { date: '2025-07-15', amount: 60 },
        ];

        res.json(mockDividends);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch dividend data' });
    }
});

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Add a specific route to serve index.html
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Adjust the fallback route to exclude static file requests
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.includes('.')) {
        return next(); // Skip to the next middleware for API or static file requests
    }
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});