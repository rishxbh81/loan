import React, { useState, useEffect } from "react";
import { Button } from "../components/common/Button";
import styles from "./style/Support.module.css";
import { CloseIcon } from "../components/common/assets";
import { fetchTickets, createTicket } from "./helper/supportHelper";

const Support = () => {
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [showTicketsOverlay, setShowTicketsOverlay] = useState(false);
  const [formData, setFormData] = useState({
    query_type: "",
    description: "",
  });

  const query_types = ["Loan Application", "Payments", "Account", "General"];

  useEffect(() => {
    const getTickets = async () => {
      const data = await fetchTickets(setLoading);
      setTickets(data);
    };
    getTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.query_type || !formData.description) {
      showToast("error", "Please fill all fields");
      return;
    }

    setLoading(true);
    const newTicket = await createTicket(formData, setLoading);
    if (newTicket) {
      setTickets([newTicket, ...tickets]);
      setFormData({ query_type: "", description: "" });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Support Center</h1>

      {/* Create Ticket Form */}
      <div className={styles.formContainer}>
        <h2>Create New Support Ticket</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Query Type</label>
            <select
              value={formData.query_type}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, query_type: e.target.value }))
              }
              className={styles.select}
            >
              <option value="">Select Query Type</option>
              {query_types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className={styles.textarea}
              rows="4"
              placeholder="Describe your issue..."
            />
          </div>

          <Button
            type="submit"
            text={loading ? "Submitting..." : "Submit Ticket"}
            disabled={loading}
          />
        </form>
      </div>

      {/* Existing Tickets */}
      <div className={styles.ticketsButton}>
        <Button
          text={`View My Tickets (${tickets.length})`}
          onClick={() => setShowTicketsOverlay(true)}
        />
      </div>

      {/* Tickets Overlay */}
      {showTicketsOverlay && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <div className={styles.overlayHeader}>
              <h2>Your Tickets</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowTicketsOverlay(false)}
              >
                <CloseIcon />
              </button>
            </div>

            {tickets.length > 0 ? (
              <div className={styles.ticketsList}>
                {tickets.map((ticket, index) => (
                  <div
                    key={ticket._id || `ticket-${index}`}
                    className={styles.ticketCard}
                  >
                    <div className={styles.ticketHeader}>
                      <span className={styles.ticketId}>
                        #{index + 1}. {ticket.ticket_id}
                      </span>
                      <span
                        className={`${styles.status} ${
                          styles[ticket.status.toLowerCase()]
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <div className={styles.ticketBody}>
                      <h3>{ticket.query_type}</h3>
                      <p>{ticket.description}</p>
                      <div className={styles.ticketFooter}>
                        <span className={styles.createdDate}>
                          Created:{" "}
                          {new Date(ticket.createdAt).toLocaleDateString()}{" "}
                          {new Date(ticket.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                        {ticket.comments && (
                          <p className={styles.comments}>
                            Comments: {ticket.comments}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noTickets}>No tickets found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
