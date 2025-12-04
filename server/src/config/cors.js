const cors = require('cors');

const PRODUCTION_FRONTEND = process.env.CLIENT_URL; // Render Env Variable

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl)
    if (!origin) return callback(null, true);

    // Allow the exact domain from Render env
    if (origin === PRODUCTION_FRONTEND) {
      return callback(null, true);
    }

    // Allow any Vercel frontend domain (*.vercel.app)
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // Allow local development
    if (origin === 'http://localhost:5173') {
      return callback(null, true);
    }

    console.log('❌ CORS Blocked Origin:', origin);
    console.log('Allowed:', PRODUCTION_FRONTEND, '*.vercel.app', 'http://localhost:5173');

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = corsOptions;
