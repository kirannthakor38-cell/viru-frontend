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

// =======================
// MIDDLEWARE (ORDER MATTERS)
// =======================

// Request logger
import requestLogger from './middlewares/logger.js';
app.use(requestLogger);

// ✅ FIXED CORS (EXPLICIT ORIGINS + PREFLIGHT)
app.use(cors({
    origin: [
        'http://localhost:5173',              // Local Vite
        'https://viru-frontend.vercel.app'    // Production frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// ✅ Handle preflight requests
app.options('*', cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// STATIC FILES
// =======================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =======================
// ROUTES
// =======================
app.use('/api/auth', authRoutes);
app.use('/api/papdi', papdiRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/business', businessRoutes);

// =======================
// HEALTH CHECK
// =======================
app.get('/api/ping', (req, res) => {
    res.json({ status: 'ok', message: 'Pong!' });
});

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Papdi App API is running...' });
});

// =======================
// ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: err.message || 'Server Error'
    });
});

// =======================
// SERVER START
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);

    // ⚠️ Self-ping (does NOT prevent Render sleep, but safe)
    const interval = 5 * 60 * 1000; // 5 minutes

    setInterval(async () => {
        try {
            const url =
                process.env.RENDER_EXTERNAL_URL ||
                `http://localhost:${PORT}`;

            await axios.get(`${url}/api/ping`);
            console.log(`[${new Date().toISOString()}] Self-ping success`);
        } catch (error) {
            console.error(
                `[${new Date().toISOString()}] Self-ping failed:`,
                error.message
            );
        }
    }, interval);
});
