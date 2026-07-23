import { useState } from "react";
import { CATEGORY_SUGGESTIONS, COMPLAINT_CATEGORIES } from "../constants/categories";

const CATEGORY_TO_DEPARTMENT_ID = {
  Infrastructure: 1,
  Faculty: 2,
  Library: 3,
  Hostel: 4,
  Others: 5
};

function ComplaintForm({ onSubmit, loading = false }) {
  const [form, setForm] = useState({
    category: "Infrastructure",
    issue_type: "",
    title: "",
    description: ""
  });

  const [isCustom, setIsCustom] = useState(false);
  const departmentId = CATEGORY_TO_DEPARTMENT_ID[form.category] || null;

  const suggestions = CATEGORY_SUGGESTIONS[form.category] || [];

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setForm((prev) => ({
      ...prev,
      category: newCategory,
      issue_type: "",
      title: ""
    }));
    setIsCustom(false);
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion === "Others") {
      setIsCustom(true);
      setForm((prev) => ({
        ...prev,
        issue_type: "Others",
        title: ""
      }));
    } else {
      setIsCustom(false);
      setForm((prev) => ({
        ...prev,
        issue_type: suggestion,
        title: suggestion
      }));
    }
  };

  const handleDescriptionChange = (e) => {
    setForm((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleCustomTitleChange = (e) => {
    setForm((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !departmentId) {
      alert("Please fill in all fields");
      return;
    }

    onSubmit({
      department_id: departmentId,
      issue_type: form.issue_type || "Others",
      title: form.title,
      description: form.description
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Department Dropdown */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          Select Department
        </label>
        <select
          value={form.category}
          onChange={handleCategoryChange}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        >
          {COMPLAINT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Issue Type Buttons Grid */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          Select Issue Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {suggestions.map((suggestion) => {
            const isSelected = form.issue_type === suggestion;
            return (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={`h-11 rounded-lg border text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center justify-center text-center px-2.5 ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {suggestion}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Issue Title Input */}
      {isCustom ? (
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Issue Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={handleCustomTitleChange}
            placeholder="Enter issue title"
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            required
          />
        </div>
      ) : (
        form.issue_type && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs font-semibold text-blue-800">
            Selected Issue: <span className="font-bold">{form.title}</span>
          </div>
        )
      )}

      {/* Detailed Description Box */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          Detailed Description
        </label>
        <textarea
          value={form.description}
          onChange={handleDescriptionChange}
          placeholder="Describe your complaint in detail..."
          rows="4"
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !form.issue_type || !departmentId}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 shadow-sm"
      >
        {loading ? "Submitting Complaint..." : "Submit Complaint"}
      </button>
    </form>
  );
}

export default ComplaintForm;
