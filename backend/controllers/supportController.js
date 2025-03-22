const { SupportTicket, generateTicketId } = require("../models/SupportTicket");

const createTicket = async (req, res) => {
    try {
      const user_id = req.user?.user_id; 
      if (!user_id) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
      const { query_type, description } = req.body;
      if (!query_type || !description) {
        return res.status(400).json({ error: "Query type and description are required." });
      }
      const newTicket = new SupportTicket({
        ticket_id,
        user_id,
        query_type,
        description,
        status: "Open",
      });
      await newTicket.save();
      res.status(201).json({ status: "success", ticket_id });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
const getAllTickets = async (req, res) => {
  try {
    const user_id = req.user?.user_id?.toString(); 
    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    const tickets = await SupportTicket.find({ user_id }).sort({ created_at: -1 });
    res.status(200).json({ status: "success", tickets });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getTicketById = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const ticket = await SupportTicket.findOne({ ticket_id });
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.status(200).json({ status: "success", ticket });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const updateTicket = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { status, comments } = req.body;

    if (!["Open", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const ticket = await SupportTicket.findOneAndUpdate(
      { ticket_id },
      { status, comments },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.status(200).json({ status: "success", ticket });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createTicket, getAllTickets, getTicketById, updateTicket };
