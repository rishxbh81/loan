import { useState } from "react";
import { motion } from "framer-motion";
import GradientButton from "../../common/GradientButton";
import { FeedbackCard } from "../jsx/feedbackCard";
import styles from "./style/FeedbackForm.module.css";
import { Loader } from "../../common/Loader";
import { showToast } from "../../../utils/toastUtils";

import { submitFeedback } from "./helper/feedbackHelper";

const feelings = [
  { emoji: "😢", label: "Very Bad", rating: 1 },
  { emoji: "😔", label: "Bad", rating: 2 },
  { emoji: "😐", label: "Nuetral", rating: 3 },
  { emoji: "🙂", label: "Good", rating: 4 },
  { emoji: "🥰", label: "Very Happy", rating: 5 },
];

export default function FeedbackForm() {
  const [selected, setSelected] = useState(4);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!comment.trim()) {
      showToast("error", "Please enter feedback before submitting.");
      return;
    }

    setLoading(true);
    setMessage("");
    const feedbackData = {
      rating: feelings[selected].rating,
      comments: comment,
    };

    const { success, data, error } = await submitFeedback(feedbackData);
    if (success) {
      showToast("success", data.message || "Feedback submitted successfully");
    } else {
      setMessage(error || data.message || "Failed to submit feedback");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className={styles.center}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Feedback Form</h2>

      <FeedbackCard className={styles.card}>
        <h2 className={styles.Ftitle}>Got feedback for us?</h2>
        <p className={styles.subtitle}>
          Your input helps us improve our service.
        </p>

        <div className={styles.emojiContainer}>
          {feelings.map((feeling, index) => (
            <motion.button
              key={index}
              animate={{
                scale: selected === index ? 1.1 : 1,
                transition: { type: "spring", stiffness: 300, damping: 10 },
              }}
              whileHover={{ scale: 1.2, transition: { duration: 0.3 } }}
              onClick={() => setSelected(index)}
              className={`${styles.emojiButton} ${
                selected === index ? styles.selectedEmoji : ""
              }`}
            >
              {feeling.emoji}
            </motion.button>
          ))}
        </div>

        <p className={styles.selectedLabel}>{feelings[selected].label}</p>

        <textarea
          className={styles.textarea}
          rows={3}
          placeholder="Add valuable feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <GradientButton
          label={loading ? "Submitting..." : "Submit"}
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={loading}
        />
        {message && <p className={styles.message}>{message}</p>}
      </FeedbackCard>
    </div>
  );
}
