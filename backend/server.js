const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');

if (!process.env.GITHUB_TOKEN) {
    console.warn('\x1b[33m%s\x1b[0m', 'WARNING: GITHUB_TOKEN is not set. GitHub API rate limits will be severely restricted (60 requests/hour).');
}

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration for Production
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Fallback to local Vite dev server
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
