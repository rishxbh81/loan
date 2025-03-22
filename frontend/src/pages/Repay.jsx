import React, { useEffect, useState } from "react";
import styles from "./style/Repay.module.css";
import { Button } from "../components/common/Button";
import { IconBtn } from "../components/common/IconBtn";
import { Infoicon } from "../components/common/assets";
import { Loader } from "../components/common/Loader";
import { useNavigate } from "react-router-dom";
import PaymentModal from "../components/common/PaymentModal";
import { fetchLoans, fetchRepaymentSchedule } from "./helper/repayHelper";

const RepaymentSchedule = () => {
  const [loans, setLoans] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [selectedRepayment, setSelectedRepayment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getLoans = async () => {
      setLoading(true);
      const data = await fetchLoans();
      setLoans(data);
      setLoading(false);
    };
    getLoans();
  }, []);

  const handleFetchRepaymentSchedule = async (loanId) => {
    setLoading(true);
    const data = await fetchRepaymentSchedule(loanId);
    setSchedule(data);
    setSelectedLoan(loanId);
    setLoading(false);
  };

  const showRepaymentDetails = (repayment) => {
    setSelectedRepayment(repayment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRepayment(null);
  };

  // Update the table rendering to match the API data structure
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Loan Repayments</h1>

      {loading ? (
        <Loader />
      ) : loans.length === 0 ? (
        <div className={styles.noLoansMessage}>No active loans found</div>
      ) : !selectedLoan ? (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className="py-2 px-4 text-center">S.No</th>
                  <th className="py-2 px-4 text-center">Loan ID</th>

                  <th className="py-2 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan, index) => (
                  <tr key={loan.loan_id}>
                    <td className="py-2 px-4 text-center">{index + 1}</td>
                    <td className="py-2 px-4 text-center">{loan.loan_id}</td>

                    <td className="py-2 px-4 text-left">
                      <Button
                        onClick={() => handleFetchRepaymentSchedule(loan.loan_id)}
                        text="View"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button
            onClick={() => navigate("/loan-list")}
            text="View All Loans"
            className={styles.viewAllButton}
          />
        </>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className="py-2 px-4 text-center">S.No</th>
                  <th className="py-2 px-4 text-center">Due Date</th>
                  <th className="py-2 px-4 text-center">EMI Amount</th>
                  <th className="py-2 px-4 text-center">Status</th>
                  <th className="py-2 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((repayment, index) => (
                  <tr key={`${selectedLoan}-${index}`}>
                    <td className="py-2 px-4 text-center">{index + 1}</td>
                    <td className="py-2 px-4 text-center">{repayment.date}</td>
                    <td className="py-2 px-4 text-center">
                      ₹{repayment.amount}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {repayment.status}
                    </td>
                    <td className={styles.btnContainer}>
                      {repayment.status === "Pending" && (
                        <>
                          <Button
                            text="Pay"
                            onClick={() => {
                              setSelectedRepayment(repayment);
                              setShowPaymentModal(true);
                            }}
                          />
                          <IconBtn
                            icon={<Infoicon />}
                            onClick={() => showRepaymentDetails(repayment)}
                          />
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button
            onClick={() => setSelectedLoan(null)}
            text="Back to Loans"
            className={styles.backButton}
          />
        </>
      )}

      {/* Modal remains unchanged */}
      {modalOpen && selectedRepayment && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Repayment Details</h2>
            <p>
              <strong>Due Date:</strong> {selectedRepayment.date}
            </p>
            <p>
              <strong>Amount:</strong> {selectedRepayment.amount}
            </p>
            <p>
              <strong>Status:</strong> {selectedRepayment.status}
            </p>
            <div className={styles.modalActions}>
              <Button onClick={closeModal} text="Close" />
            </div>
          </div>
        </div>
      )}

      {/* Add PaymentModal */}
      {showPaymentModal && selectedRepayment && (
        <PaymentModal
          repaymentDetails={selectedRepayment}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            fetchRepaymentSchedule(selectedLoan); // Refresh the schedule
          }}
        />
      )}
    </div>
  );
};

export default RepaymentSchedule;
