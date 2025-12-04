const cors = require('cors');

const allowedOrigins = [
  process.env.CLIENT_URL,               // your Vercel frontend
  'https://neocube.vercel.app',         // fallback
  'http://localhost:5173',               // local dev
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow server-to-server & curl (no origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS Blocked Origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },

  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = corsOptions;
