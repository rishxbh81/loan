import React, { useEffect, useState } from "react";
import styles from "./style/OppPage.module.css";
import { Loader } from "../../common/Loader";
import { showToast } from "../../../utils/toastUtils";
import { Button } from "../../common/Button";
import { IconBtn } from "../../common/IconBtn";
import { CloseIcon, CheckIcon, Infoicon } from "../../common/assets";

import { fetchLoans } from "./helper/investmentHelper";
import { confirmInvestmentRequest } from "./helper/investmentHelper";

const InvestmentOpportunities = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [filters, setFilters] = useState({ amount: "", roi: "", tenure: "" });
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(false);

  useEffect(() => {
    const getLoans = async () => {
      const { success, data, error } = await fetchLoans();
      if (success) {
        setLoans(data);
        setFilteredLoans(data);
      } else {
        setError(error);
        showToast("error", error);
      }
      setLoading(false);
    };

    getLoans();
  }, []);

  const confirmInvestment = async () => {
    if (!selectedLoan) return;

    const { success, data, error } = await confirmInvestmentRequest(
      selectedLoan.loan_id,
      selectedLoan.amount
    );

    if (success) {
      showToast("success", "Investment confirmed successfully");
      closeModals();
      setLoadingLoans(true);

      const { success: fetchSuccess, data: newData } = await fetchLoans();
      if (fetchSuccess) {
        setLoans(newData);
        setFilteredLoans(newData);
      }
      setLoadingLoans(false);
    } else {
      showToast("error", error);
    }
  };

  const openLoanDetails = (loan) => {
    setSelectedLoan(loan);
  };

  const openConfirmModal = (loan) => {
    setSelectedLoan(loan);
    setConfirmModal(true);
  };

  const closeModals = () => {
    setSelectedLoan(null);
    setConfirmModal(false);
  };

  const applyFilters = () => {
    setFilteredLoans(
      loans.filter((loan) => {
        return (
          (filters.amount === "" || loan.amount <= Number(filters.amount)) &&
          (filters.roi === "" || loan.roi >= Number(filters.roi)) &&
          (filters.tenure === "" || loan.tenure <= Number(filters.tenure))
        );
      })
    );
  };

  const clearFilters = () => {
    setFilters({ amount: "", roi: "", tenure: "" });
    setFilteredLoans(loans);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className={styles.center}>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <h2 className={styles.title}>Investment Oppurtunity</h2>
      <div className={styles.container}>
        <div className={styles.filtersContainer}>
          <input
            type="number"
            placeholder="Amount"
            className={styles.filterInput}
            value={filters.amount}
            onChange={(e) => handleFilterChange("amount", e.target.value)}
          />
          <input
            type="number"
            placeholder="ROI"
            className={styles.filterInput}
            value={filters.roi}
            onChange={(e) => setFilters({ ...filters, roi: e.target.value })}
          />
          <input
            type="number"
            placeholder="Tenure"
            className={styles.filterInput}
            value={filters.tenure}
            onChange={(e) => setFilters({ ...filters, tenure: e.target.value })}
          />
          <div className={styles.btnArea}>
            <IconBtn
              onClick={applyFilters}
              icon={<CheckIcon />}
              tooltip="Apply Filters"
            />
            {filters.amount || filters.roi || filters.tenure ? (
              <IconBtn
                onClick={clearFilters}
                icon={<CloseIcon />}
                tooltip="Clear Filters"
              />
            ) : null}
          </div>
        </div>
        {loadingLoans ? (
          <div className={styles.center}>
            <Loader /> {/* Show loader when fetching loans */}
          </div>
        ) : filteredLoans.length > 0 ? (
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th className="py-2 px-4 text-center">SNO</th>
                  <th className="py-2 px-4 text-center">Borrower Name</th>
                  <th className="py-2 px-4 text-center">Requested Amount</th>
                  <th className="py-2 px-4 text-center">ROI</th>
                  <th className="py-2 px-4 text-center">Tenure</th>
                  <th className="py-2 px-4 text-center">Status</th>
                  <th className="py-2 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 text-center">{index + 1}</td>
                    <td className="py-2 px-4 text-center">
                      {loan.borrower_name}
                    </td>
                    <td className="py-2 px-4 text-center">{loan.amount}</td>
                    <td className="py-2 px-4 text-center">{loan.roi}</td>
                    <td className="py-2 px-4 text-center">{loan.tenure}</td>
                    <td className="py-2 px-4 text-center">{loan.status}</td>
                    <td className="py-2 px-4 text-center">
                      <div className={styles.actions}>
                        <IconBtn
                          onClick={() => openLoanDetails(loan)}
                          icon={<Infoicon />}
                        />
                        <Button
                          onClick={() => openConfirmModal(loan)}
                          text="Invest"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No investment opportunities available.</p>
        )}
      </div>

      {selectedLoan && !confirmModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Loan Details</h2>
            <p>
              <strong>Loan ID:</strong> {selectedLoan.loan_id}
            </p>
            <p>
              <strong>Borrower Name:</strong> {selectedLoan.borrower_name}
            </p>
            <p>
              <strong>Amount:</strong> {selectedLoan.amount}
            </p>
            <p>
              <strong>ROI:</strong> {selectedLoan.roi}
            </p>
            <p>
              <strong>Tenure:</strong> {selectedLoan.tenure}
            </p>
            <p>
              <strong>Status:</strong> {selectedLoan.status}
            </p>
            <div className={styles.modalActions}>
              <Button
                onClick={() => openConfirmModal(selectedLoan)}
                text="Invest"
              />
              <Button onClick={closeModals} text="Close" />
            </div>
          </div>
        </div>
      )}

      {confirmModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Confirm Investment</h2>
            <p>
              <strong>Loan ID:</strong> {selectedLoan.loan_id}
            </p>
            <p>
              <strong>Amount:</strong> {selectedLoan.amount}
            </p>
            <p>
              <strong>ROI:</strong> {selectedLoan.roi}
            </p>
            <p>
              <strong>Tenure:</strong> {selectedLoan.tenure}
            </p>
            <div className={styles.modalActions}>
              <Button onClick={confirmInvestment} text="Confirm" />
              <Button onClick={closeModals} text="Cancel" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvestmentOpportunities;
