const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema(
  {
    ticket_id: { type: String, unique: true, required: true },
    user_id: { type: String, required: true },
    query_type: {
      type: String,
      required: true,
      enum: ["Loan Application", "Payments", "Account", "General"],
    },
    description: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
    comments: { type: String, default: "" },
  },
  { timestamps: true }
);

const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);

// Function to generate a unique ticket ID
const generateTicketId = async () => {
  const generateId = () => {
    const number = Math.floor(10000 + Math.random() * 90000);
    return "T" + number;
  };

  let unique = false;
  let ticketId;

  while (!unique) {
    ticketId = generateId();
    const existingTicket = await SupportTicket.findOne({ ticket_id: ticketId });
    if (!existingTicket) unique = true;
  }

  return ticketId;
};

module.exports = { SupportTicket, generateTicketId };
