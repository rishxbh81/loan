import React, { useState } from "react";
import { Button } from "./Button";
import { API_BASE_URL } from "../../config";
import { showToast } from "../../utils/toastUtils";
import styles from "./style/PaymentModal.module.css";
import { DownloadIcon } from "./assets";

const PaymentModal = ({ repaymentDetails, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("proof_file", file);
      formData.append("repayment_id", repaymentDetails.id);

      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}auth/upload-proof`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        showToast("success", "Payment proof uploaded successfully");
        onSuccess();
      } else {
        throw new Error("Failed to upload payment proof");
      }
    } catch (error) {
      showToast("error", error.message);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {step === 1 ? (
          <>
            <div className={styles.headerContainer}>
              <h2>Scan QR to Pay</h2>
              <div className={styles.downloadIcon}>
                <DownloadIcon />
              </div>
            </div>
            <div className={styles.qrContainer}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                alt="Payment QR Code"
                className={styles.qrCode}
              />
            </div>
            <p>
              Amount to Pay:{" "}
              <span className={styles.amount}>₹{repaymentDetails.amount}</span>{" "}
            </p>
            <div className={styles.buttonGroup}>
              <Button text="Cancel" onClick={onClose} />
              <Button text="Done" onClick={() => setStep(2)} />
            </div>
          </>
        ) : (
          <>
            <h1 className={styles.header}>Upload Payment Proof</h1>
            <div className={styles.formSection}>
              <div
                className={styles.uploadBox}
                onClick={() => document.getElementById("fileInput").click()}
                role="button"
              >
                <input
                  id="fileInput"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (!file.type.startsWith("image/")) {
                        showToast("error", "Please upload only image files");
                        e.target.value = "";
                        return;
                      }
                      setFile(file);
                    }
                  }}
                  className={styles.hiddenInput}
                />
                {file ? (
                  <div className={styles.fileInfo}>
                    <p className={styles.fileName}>{file.name}</p>
                  </div>
                ) : (
                  <div className={styles.upload}>
                    <DownloadIcon />
                    <p>Click to upload payment proof</p>
                  </div>
                )}
              </div>
              <div className={styles.buttonWrapper}>
                <Button text="Back" onClick={() => setStep(1)} />
                <Button
                  text="Submit"
                  onClick={handleFileUpload}
                  disabled={!file}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
