import React from "react";
import { Trash2, ArrowLeft } from "lucide-react";
import { deletePortfolioItem } from "../../../firebase/firestore";

const DeletePortfolio = ({ item, onBack }) => {
  const handleDelete = async () => {
    const confirm = window.confirm(
      `Are you sure you want to delete "${item?.title}"?`
    );

    if (!confirm) return;

    try {
      await deletePortfolioItem(item.category, item.id);
      onBack(); // go back to list
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      alert("Failed to delete item");
    }
  };

  if (!item) {
    return (
      <div className="p-6 bg-white border rounded-lg">
        <p className="text-gray-700">No item selected for deletion.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white border rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h2 className="text-xl font-bold text-gray-900">Delete Portfolio Item</h2>
      </div>

      {/* Warning Box */}
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <p className="text-red-700 font-medium flex items-center gap-2">
          <Trash2 size={18} /> Warning
        </p>
        <p className="text-red-600 mt-1">
          You are about to permanently delete:
        </p>
        <p className="text-lg font-semibold mt-2 text-gray-900">{item.title}</p>
        <p className="text-sm text-gray-600">{item.location?.address}</p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
        >
          <Trash2 size={18} />
          Delete Permanently
        </button>
      </div>
    </div>
  );
};

export default DeletePortfolio;
