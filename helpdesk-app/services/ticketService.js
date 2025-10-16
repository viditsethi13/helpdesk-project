import axios from "axios";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

// Create a reusable axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const TicketService = {
  // Create a new support ticket
  createTicket: (ticketData) => api.post("/api/tickets", ticketData),

  // Get all tickets
  getTickets: () => api.get("/api/tickets"),

  // Update a ticket (status or log)
  updateTicket: (id, data) => api.patch(`/api/tickets/${id}`, data),
};
