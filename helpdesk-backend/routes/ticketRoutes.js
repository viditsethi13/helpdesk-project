const express = require('express');
const router = express.Router();
const controller = require('../controllers/ticketController');

router.get('/', controller.getAllTickets);
router.post('/', controller.createTicket);
router.patch('/:id', controller.updateTicket);

module.exports = router;
