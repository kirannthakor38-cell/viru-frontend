import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import connectDB from './config/db.js';

// Routes
import authRoutes from './routes/auth.js';
import papdiRoutes from './routes/papdi.js';
import orderRoutes from './routes/order.js';
import deliveryRoutes from './routes/delivery.js';
import businessRoutes from './routes/business.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
import requestLogger from './middlewares/logger.js';
app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/papdi', papdiRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/business', businessRoutes);

// Health check endpoint
app.get('/api/ping', (req, res) => {
    res.json({ status: 'ok', message: 'Pong!' });
});

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Papdi App API is running...' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);

    // Self-ping to keep server awake on Render (Free Tier)
    const interval = 5 * 60 * 1000; // 5 minutes
    setInterval(async () => {
        try {
            // Render automatically provides RENDER_EXTERNAL_URL
            const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
            await axios.get(`${url}/api/ping`);
            console.log(`[${new Date().toISOString()}] Self-ping success: ${url}`);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Self-ping failed: ${error.message}`);
        }
    }, interval);
});
