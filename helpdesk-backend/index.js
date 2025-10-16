const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => res.send('pong'));

// Routes
app.use('/api/tickets', ticketRoutes);

// Initialize DB
sequelize.sync().then(() => {
  console.log('Database synced');
});

// Export app for Vercel
module.exports = app;
