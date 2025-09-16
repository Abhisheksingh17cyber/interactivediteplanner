/* ====================================
   MAIN SERVER FILE
   Express.js Server with API Endpoints
   ==================================== */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import routes and middleware
const apiRoutes = require('./src/routes/api');
const pdfRoutes = require('./src/routes/pdf');

// Create simple logger if not exists
const logger = {
    info: (message, meta) => console.log(`[INFO] ${message}`, meta ? JSON.stringify(meta) : ''),
    error: (message, meta) => console.error(`[ERROR] ${message}`, meta ? JSON.stringify(meta) : ''),
    warn: (message, meta) => console.warn(`[WARN] ${message}`, meta ? JSON.stringify(meta) : '')
};

// Simple middleware
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-Request-Time']
}));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    const requestId = req.headers['x-request-id'] || generateRequestId();
    req.requestId = requestId;
    
    logger.info(`${req.method} ${req.url}`, {
        requestId,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });
    
    // Add request ID to response headers
    res.setHeader('X-Request-ID', requestId);
    
    next();
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve generated PDFs with proper headers
app.use('/downloads', express.static(path.join(__dirname, 'generated_pdfs'), {
    setHeaders: (res, path) => {
        res.setHeader('Content-Disposition', 'attachment');
        res.setHeader('Content-Type', 'application/pdf');
    }
}));

// Database connection
async function connectDatabase() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/internity_diet_planner';
        
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        logger.info('Connected to MongoDB successfully');
        
        // Initialize food database with sample data
        const { initializeFoodDatabase } = require('./src/utils/initializeDatabase');
        await initializeFoodDatabase();
        
        // Set up database event listeners
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });
        
        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });
        
    } catch (error) {
        logger.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

// API Routes
app.use('/api', apiRoutes);
app.use('/api/pdf', pdfRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };
    
    res.status(200).json(healthStatus);
});

// API status endpoint
app.get('/api/status', (req, res) => {
    res.status(200).json({
        service: 'INTERNITY DIET PLANNER API',
        version: '1.0.0',
        status: 'operational',
        timestamp: new Date().toISOString()
    });
});

// Serve main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve additional pages
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/faq', (req, res) => {
    res.sendFile(path.join(__dirname, 'faq.html'));
});

app.get('/privacy', (req, res) => {
    res.sendFile(path.join(__dirname, 'privacy.html'));
});

app.get('/terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'terms.html'));
});

// Download PDF endpoint
app.get('/api/download-pdf/:planId', async (req, res) => {
    try {
        const { planId } = req.params;
        const pdfPath = path.join(__dirname, 'generated_pdfs', `${planId}.pdf`);
        
        // Check if file exists
        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({
                success: false,
                error: 'PDF not found'
            });
        }
        
        // Get file stats
        const stats = fs.statSync(pdfPath);
        
        // Create unique download filename
        const filename = `internity-diet-plan-${planId}.pdf`;
        
        res.status(200).json({
            success: true,
            data: {
                downloadUrl: `/downloads/${planId}.pdf`,
                filename: filename,
                size: stats.size,
                created: stats.birthtime
            }
        });
        
    } catch (error) {
        logger.error('PDF download error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to prepare PDF download'
        });
    }
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown(signal) {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    // Stop accepting new connections
    server.close(() => {
        logger.info('HTTP server closed');
        
        // Close database connection
        mongoose.connection.close(() => {
            logger.info('MongoDB connection closed');
            process.exit(0);
        });
    });
    
    // Force shutdown after 30 seconds
    setTimeout(() => {
        logger.error('Forced shutdown due to timeout');
        process.exit(1);
    }, 30000);
}

// Utility functions
function generateRequestId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Ensure required directories exist
function ensureDirectories() {
    const directories = [
        path.join(__dirname, 'generated_pdfs'),
        path.join(__dirname, 'logs'),
        path.join(__dirname, 'uploads')
    ];
    
    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            logger.info(`Created directory: ${dir}`);
        }
    });
}

// Initialize server
async function startServer() {
    try {
        // Ensure required directories exist
        ensureDirectories();
        
        // Connect to database
        await connectDatabase();
        
        // Start server
        const server = app.listen(PORT, () => {
            logger.info(`INTERNITY DIET PLANNER server running on port ${PORT}`);
            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
            logger.info(`Server started at: ${new Date().toISOString()}`);
        });
        
        // Set server reference for graceful shutdown
        global.server = server;
        
        return server;
        
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
if (require.main === module) {
    startServer();
}

module.exports = app;