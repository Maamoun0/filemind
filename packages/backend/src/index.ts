import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const port = process.env.PORT || 3001;

// Trust proxy if we are behind Nginx/Docker
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Global Rate Limiting - Basic protection against DDoS / spam abuse
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests created from this IP, please try again after an 15 minutes',
});
app.use('/api', apiLimiter);

// Health Check
app.get('/', (req, res) => {
    res.json({ status: 'healthy', service: 'fileMind Backend API' });
});

import toolRoutes from './routes/tools';

// Future Route Prefix
app.use('/api/tools', toolRoutes);

app.listen(port, () => {
    console.log(`[fileMind-API] Securely running on port ${port}`);
});
