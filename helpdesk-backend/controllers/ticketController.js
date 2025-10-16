const Ticket = require('../models/Ticket');

exports.createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);
    res.json(ticket);
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
};

exports.getAllTickets = async (req, res) => {
  const tickets = await Ticket.findAll({ order: [['id', 'DESC']] });
  res.json(tickets);
};

exports.updateTicket = async (req, res) => {
  const { id } = req.params;
  const { status, log } = req.body;

  const ticket = await Ticket.findByPk(id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  if (status) ticket.status = status;
  if (log) ticket.logs = [...ticket.logs, log];

  await ticket.save();
  res.json(ticket);
};
