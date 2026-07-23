import { useEffect, useMemo, useState } from "react";
import ComplaintCard from "../components/ComplaintCard";
import ComplaintForm from "../components/ComplaintForm";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { createComplaint, getComplaintDetails, getMyComplaints } from "../services/api";
import { Plus, FolderSearch, X, Clock, UserCheck, Tag, Building, Calendar, CheckCircle2 } from "lucide-react";

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString();
}

function StudentDashboard() {
  const { token, user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const loadComplaints = async () => {
    try {
      setError("");
      const data = await getMyComplaints(token);
      setComplaints(data.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadComplaints().finally(() => setLoading(false));
  }, [token]);

  const studentName = useMemo(() => user?.name || "Student", [user]);

  const filteredComplaints = useMemo(() => {
    if (selectedFilter === "all") {
      return complaints;
    }

    if (selectedFilter === "completed") {
      return complaints.filter((c) => c.status === "resolved" || c.status === "rejected");
    }

    return complaints.filter((c) => c.status === selectedFilter);
  }, [complaints, selectedFilter]);

  const dashboardStats = useMemo(
    () => [
      {
        label: "Total Complaints",
        value: complaints.length,
        borderColor: "border-slate-200",
        tint: "bg-white",
        valueColor: "text-slate-900"
      },
      {
        label: "Pending",
        value: complaints.filter((c) => c.status === "pending").length,
        borderColor: "border-amber-200",
        tint: "bg-amber-50/60",
        valueColor: "text-amber-800"
      },
      {
        label: "In Progress",
        value: complaints.filter((c) => c.status === "in_progress").length,
        borderColor: "border-blue-200",
        tint: "bg-blue-50/60",
        valueColor: "text-blue-800"
      },
      {
        label: "Completed",
        value: complaints.filter((c) => c.status === "resolved" || c.status === "rejected").length,
        borderColor: "border-emerald-200",
        tint: "bg-emerald-50/60",
        valueColor: "text-emerald-800"
      }
    ],
    [complaints]
  );

  const openHistory = async (complaintId) => {
    setSelectedComplaint(null);
    setShowHistoryModal(true);
    setHistoryLoading(true);
    setError("");

    try {
      const data = await getComplaintDetails(complaintId, token);
      setSelectedComplaint(data.data);
    } catch (err) {
      setError(err.message);
      setShowHistoryModal(false);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    setError("");

    try {
      await createComplaint(
        {
          title: formData.title.trim(),
          department_id: formData.department_id,
          issue_type: formData.issue_type,
          description: formData.description.trim()
        },
        token
      );

      setShowComplaintModal(false);
      await loadComplaints();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-block rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                Student Dashboard
              </span>
              <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">
                Welcome back, {studentName}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Submit complaints, view status updates, and track progress in real time.
              </p>
            </div>

            <button
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 shrink-0"
              onClick={() => setShowComplaintModal(true)}
              type="button"
            >
              <Plus className="h-4 w-4" />
              <span>File New Complaint</span>
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
            {dashboardStats.map((stat) => (
              <div
                className={`rounded-xl border p-4 sm:p-5 shadow-sm ${stat.borderColor} ${stat.tint}`}
                key={stat.label}
              >
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{stat.label}</p>
                <p className={`mt-2 text-3xl font-bold ${stat.valueColor}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        {error ? (
          <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
        ) : null}

        {/* Filter Buttons */}
        <div className="mt-8 flex flex-wrap gap-2.5">
          {[
            { label: "All", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "In Progress", value: "in_progress" },
            { label: "Completed", value: "completed" }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedFilter(tab.value)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                selectedFilter === tab.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Complaints Section / Empty State */}
        {loading ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {[0, 1, 2].map((item) => (
              <div className="h-36 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm" key={item} />
            ))}
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4 border border-blue-100">
              <FolderSearch className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No complaints found</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
              You haven't submitted any complaints matching this filter yet.
            </p>
            <div className="mt-5">
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-sm"
                onClick={() => setShowComplaintModal(true)}
                type="button"
              >
                <Plus className="h-4 w-4" />
                <span>File New Complaint</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} onClick={() => openHistory(complaint.id)} />
            ))}
          </div>
        )}
      </main>

      {/* File Complaint Modal */}
      {showComplaintModal ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 animate-fade-in">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xl">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">File New Complaint</h2>
                <p className="text-xs text-slate-500">Fill in the details below to submit your issue</p>
              </div>
              <button
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                onClick={() => setShowComplaintModal(false)}
                type="button"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ComplaintForm onSubmit={handleFormSubmit} loading={submitting} />
          </div>
        </div>
      ) : null}

      {/* Status History Modal */}
      {showHistoryModal ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 animate-fade-in">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Complaint Details & Timeline</h2>
                <p className="text-xs text-slate-500">View progress updates and resolution notes</p>
              </div>
              <button
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                onClick={() => setShowHistoryModal(false)}
                type="button"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {historyLoading ? (
              <div className="mt-6 space-y-3">
                <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
              </div>
            ) : selectedComplaint ? (
              <div className="mt-5 space-y-5">
                {/* Details Section */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{selectedComplaint.title}</h3>
                    <p className="mt-1 text-slate-600 leading-relaxed text-xs sm:text-sm">{selectedComplaint.description}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-xs text-slate-600">
                    <div>
                      <span className="font-semibold text-slate-800">Category:</span> {selectedComplaint.category}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">Department:</span> {selectedComplaint.dept_name || "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">Submitted:</span> {formatDate(selectedComplaint.created_at)}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Status Updates</h4>
                  <div className="space-y-3">
                    {selectedComplaint.status_history?.length > 0 ? (
                      selectedComplaint.status_history.map((item, index) => (
                        <div
                          className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm text-xs sm:text-sm"
                          key={`${item.updated_at}-${index}`}
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold border border-blue-200">
                            <Clock className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 uppercase text-xs tracking-wider">{item.status}</span>
                              <span className="text-[11px] text-slate-400">{formatDateTime(item.updated_at)}</span>
                            </div>
                            <p className="mt-1 text-slate-600">{item.remarks || "No remarks provided."}</p>
                            <p className="mt-1 text-[11px] text-slate-400 font-medium">
                              Updated by: {item.updated_by_name}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="rounded-xl border border-dashed border-slate-200 p-4 text-xs text-slate-500 text-center">
                        No status updates yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default StudentDashboard;
