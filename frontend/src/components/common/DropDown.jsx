import React, { useState } from "react";
import styles from "./style/DropDown.module.css";

const Dropdown = ({ options, label, onChange, selectedValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    selectedValue || options[0] || "Select"
  );

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(option); // Pass selected option back to parent
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdownArea} onClick={() => setIsOpen(!isOpen)}>
      <p className={styles.label}>{label}</p>
      <div className={styles.dropdown}>
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOption}
        </button>
        {isOpen && (
          <ul
            className={`${styles.list} ${styles.webkitScrollbar}`}
            role="list"
          >
            {options.map((option, index) => (
              <li
                key={index}
                className={styles.listitem}
                role="listitem"
                onClick={() => handleSelect(option)}
              >
                <article className={styles.article}>{option}</article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
