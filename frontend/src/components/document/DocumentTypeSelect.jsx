import style from "./style/File.module.css";
import Dropdown from "../common/Dropdown";

export const DocumentTypeSelect = ({ value, onChange }) => {
  const documentOptions = ["ID Proof", "Aadhar", "PAN", "Other"];

  return (
    <div className="flex justify-center items-center w-full ml-2">
      <div className=" max-w-lg">
        <label htmlFor="type" className={style.fileName}>
          Document Type
        </label>
        <Dropdown
          options={documentOptions}
          selectedValue={value}
          onChange={onChange} // Pass selected option back
        />
      </div>
    </div>
  );
};
