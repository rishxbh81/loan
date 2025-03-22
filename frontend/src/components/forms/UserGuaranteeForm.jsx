import React from "react";
import styles from "../../Styles/PageSlider.module.css";

const UserGuaranteeForm = ({ formData, handleInputChange, text }) => {
  return (
    <div className={styles.formSection}>
      <div className={styles.inputField}>
        <label className={styles.llabel}>{text}'s Name (as per PAN)</label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
      </div>
      <div className={styles.inputField}>
        <label className={styles.llabel}>{text}'s Parent Name</label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="Parent Name"
            value={formData.parent_name}
            onChange={handleInputChange}
            className={styles.input}
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            required
          />
        </div>
      </div>

      <div className={styles.inputField}>
        <label className={styles.llabel}>{text}'s Address</label>
        <div className={styles.inputWrapper}>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
      </div>

      <div className={styles.inputField}>
        <label className={styles.llabel}>{text}'s Mobile Number</label>
        <div className={styles.inputWrapper}>
          <input
            type="tel"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^[0-9]+$/.test(value)) {
                handleInputChange(e);
              }
            }}
            className={styles.input}
            maxLength={10}
            required
          />
        </div>
      </div>

      <div className={styles.inputField}>
        <label className={styles.llabel}>{text}'s Bank Account Number</label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="bank_account_number"
            value={formData.bank_account_number}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default UserGuaranteeForm;
