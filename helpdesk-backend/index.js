const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Open in-memory database for Vercel
const db = new Database(':memory:');

// Create table with logs column (stored as JSON string)
db.prepare(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    description TEXT,
    attachment TEXT,
    status TEXT DEFAULT 'new',
    logs TEXT DEFAULT '[]'
  )
`).run();

// Ping route
app.get('/ping', (req, res) => res.send('pong'));

// POST: create ticket
app.post('/api/tickets', (req, res) => {
  const { name, email, description, attachment } = req.body;
  const stmt = db.prepare(
    `INSERT INTO tickets (name, email, description, attachment) VALUES (?, ?, ?, ?)`
  );
  const info = stmt.run(name, email, description, attachment);
  res.json({ id: info.lastInsertRowid, name, email, description, attachment, status: 'new', logs: [] });
});

// GET: all tickets
app.get('/api/tickets', (req, res) => {
  const rows = db.prepare(`SELECT * FROM tickets ORDER BY id DESC`).all();
  // Parse logs JSON before sending
  const tickets = rows.map(ticket => ({
    ...ticket,
    logs: JSON.parse(ticket.logs)
  }));
  res.json(tickets);
});

// PATCH: update status or add response log
app.patch('/api/tickets/:id', (req, res) => {
  const { status, log } = req.body;

  // Fetch current ticket
  const ticket = db.prepare(`SELECT * FROM tickets WHERE id = ?`).get(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  let updated = false;

  // Update status if provided
  if (status) {
    db.prepare(`UPDATE tickets SET status = ? WHERE id = ?`).run(status, req.params.id);
    updated = true;
  }

  // Add log if provided
  if (log) {
    const logs = JSON.parse(ticket.logs || '[]');
    logs.push(log);
    db.prepare(`UPDATE tickets SET logs = ? WHERE id = ?`).run(JSON.stringify(logs), req.params.id);
    updated = true;
  }

  if (!updated) return res.status(400).json({ error: 'Nothing to update' });

  // Return updated ticket
  const updatedTicket = db.prepare(`SELECT * FROM tickets WHERE id = ?`).get(req.params.id);
  updatedTicket.logs = JSON.parse(updatedTicket.logs);
  res.json(updatedTicket);
});

// Export Express app as a serverless function
module.exports = app;
  