const Dialog = ({ open, title, message, onClose, type = "info" }) => {
  if (!open) return null;

  const colors = {
    error: "bg-red-100 border-red-300 text-red-700",
    success: "bg-green-100 border-green-300 text-green-700",
    info: "bg-blue-100 border-blue-300 text-blue-700",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80 animate-fadeIn">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>

        <p className={`p-3 rounded border ${colors[type]}`}>
          {message}
        </p>

        <button
          className="mt-5 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Dialog;
