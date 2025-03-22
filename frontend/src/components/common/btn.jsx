// Btn Component
const Btn = ({ label, onClick, icon: icon }) => {
  return (
    <button
      className={`bg-white text-center w-48 rounded-2xl h-10 relative text-black text-xl font-semibold group border border-solid border-[#333]`}
      type="button"
      onClick={onClick}
    >
      <div className="bg-green-500 rounded-xl h-8 w-1/4 flex items-center justify-center absolute left-1 top-[4px] ">
        {/* Render the passed icon dynamically */}
        {icon && <span>{icon}</span>}
      </div>
      <p className="translate-x-2 text-black ml-5">{label}</p>
    </button>
  );
};

export default Btn;
