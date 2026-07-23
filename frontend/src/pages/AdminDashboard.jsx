import { useState, useEffect, useCallback } from 'react';
import { getAllComplaints, getComplaintDetails, updateComplaintStatus } from '../services/api';
import { LogOut, ShieldCheck, X, Check, AlertCircle, Building, Clock, User, Phone, Mail } from 'lucide-react';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [stats, setStats] = useState({ pending: 0, in_progress: 0, resolved: 0, rejected: 0 });
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateStatusValue, setUpdateStatusValue] = useState('');
  const [updateRemarks, setUpdateRemarks] = useState('');
  const [submitStatus, setSubmitStatus] = useState(''); // pending, success, error
  const [error, setError] = useState('');

  // Decode JWT and get user info
  useEffect(() => {
    const authToken = localStorage.getItem('auth_token');
    if (!authToken) {
      window.location.href = '/login';
      return;
    }

    try {
      const decoded = JSON.parse(atob(authToken.split('.')[1]));
      setUser(decoded);
      setToken(authToken);
    } catch (error) {
      console.error('Failed to decode token:', error);
      localStorage.clear();
      window.location.href = '/login';
    }
  }, []);

  // Fetch complaints based on selected status
  useEffect(() => {
    if (!token) return;

    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const response = await getAllComplaints(token);
        const allComplaints = response.data || [];
        let filteredComplaints = allComplaints;

        // Filter by status if not 'all'
        if (selectedStatus !== 'all') {
          filteredComplaints = filteredComplaints.filter(
            (complaint) => complaint.status === selectedStatus
          );
        }

        setComplaints(filteredComplaints);

        const statsData = {
          pending: allComplaints.filter((c) => c.status === 'pending').length,
          in_progress: allComplaints.filter((c) => c.status === 'in_progress').length,
          resolved: allComplaints.filter((c) => c.status === 'resolved').length,
          rejected: allComplaints.filter((c) => c.status === 'rejected').length
        };
        setStats(statsData);

      } catch (error) {
        console.error('Failed to fetch complaints:', error);
        setError(error.message || 'Failed to fetch dashboard data');
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [token, selectedStatus, user?.role]);

  // Handle view complaint detail
  const handleViewComplaint = useCallback(
    async (complaintId) => {
      try {
        const response = await getComplaintDetails(complaintId, token);
        setSelectedComplaint(response.data);
        setUpdateStatusValue(response.data.status || '');
        setUpdateRemarks('');
        setSubmitStatus('');
      } catch (error) {
        console.error('Failed to fetch complaint details:', error);
      }
    },
    [token]
  );

  // Handle update complaint status
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!updateStatusValue) return;

    setUpdating(true);
    setSubmitStatus('pending');

    try {
      await updateComplaintStatus(selectedComplaint.id, updateStatusValue, token, updateRemarks);

      setSubmitStatus('success');

      setTimeout(() => {
        handleViewComplaint(selectedComplaint.id);
      }, 500);

      try {
        const response = await getAllComplaints(token);
        let filteredComplaints = response.data || [];

        if (selectedStatus !== 'all') {
          filteredComplaints = filteredComplaints.filter(
            (complaint) => complaint.status === selectedStatus
          );
        }

        setComplaints(filteredComplaints);

        const allComplaints = response.data || [];
        const statsData = {
          pending: allComplaints.filter((c) => c.status === 'pending').length,
          in_progress: allComplaints.filter((c) => c.status === 'in_progress').length,
          resolved: allComplaints.filter((c) => c.status === 'resolved').length,
          rejected: allComplaints.filter((c) => c.status === 'rejected').length
        };
        setStats(statsData);
      } catch (err) {
        console.error('Failed to refresh complaints:', err);
      }

      setTimeout(() => {
        setSelectedComplaint(null);
        setSubmitStatus('');
        setUpdating(false);
        setUpdateStatusValue('');
        setUpdateRemarks('');
      }, 1200);
    } catch (error) {
      console.error('Failed to update complaint:', error);
      setSubmitStatus('error');
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-slate-500 font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    if (status === 'pending') return 'bg-amber-100 text-amber-800 border border-amber-200';
    if (status === 'in_progress') return 'bg-blue-100 text-blue-800 border border-blue-200';
    if (status === 'resolved') return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    return 'bg-red-100 text-red-800 border border-red-200';
  };

  const getStatusLabel = (status) => {
    if (status === 'in_progress') return 'In Progress';
    if (status === 'resolved') return 'Resolved';
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending';
  };

  const totalStats = stats.pending + stats.in_progress + stats.resolved + stats.rejected;
  const chartItems = [
    { label: 'Pending', value: stats.pending, className: 'bg-amber-500' },
    { label: 'In Progress', value: stats.in_progress, className: 'bg-blue-500' },
    { label: 'Resolved', value: stats.resolved, className: 'bg-emerald-500' },
    { label: 'Rejected', value: stats.rejected, className: 'bg-red-500' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow-sm">
                CC
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight">Admin Dashboard</h2>
                <p className="text-[11px] font-medium text-slate-500">
                  {user.dept_name || 'Department Administrator'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-800">{user.name}</p>
                <p className="text-[11px] text-slate-500">{user.email || 'Admin'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl p-5 shadow-sm border bg-amber-50/60 border-amber-200">
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Pending</p>
            <p className="text-3xl font-bold text-amber-900 mt-2">{stats.pending}</p>
          </div>
          <div className="rounded-xl p-5 shadow-sm border bg-blue-50/60 border-blue-200">
            <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">In Progress</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">{stats.in_progress}</p>
          </div>
          <div className="rounded-xl p-5 shadow-sm border bg-emerald-50/60 border-emerald-200">
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Resolved</p>
            <p className="text-3xl font-bold text-emerald-900 mt-2">{stats.resolved}</p>
          </div>
          <div className="rounded-xl p-5 shadow-sm border bg-red-50/60 border-red-200">
            <p className="text-xs font-semibold text-red-800 uppercase tracking-wider">Rejected</p>
            <p className="text-3xl font-bold text-red-900 mt-2">{stats.rejected}</p>
          </div>
        </div>

        {error ? (
          <p className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
        ) : null}

        {/* Status Breakdown Bar */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Status Overview</h3>
            <span className="text-xs font-semibold text-slate-500">{totalStats} Total Complaints</span>
          </div>
          <div className="mt-4 space-y-3">
            {chartItems.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
                  <span>{item.label}</span>
                  <span className="font-bold text-slate-800">{item.value}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${item.className}`}
                    style={{ width: `${totalStats ? Math.max((item.value / totalStats) * 100, item.value ? 4 : 0) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          {[
            { label: 'All', value: 'all' },
            { label: 'Pending', value: 'pending' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Resolved', value: 'resolved' },
            { label: 'Rejected', value: 'rejected' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedStatus === tab.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500 font-medium">
              <p>Loading complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-medium">
              <p>No complaints found for this status.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100/80 border-b border-slate-200 text-xs uppercase font-semibold text-slate-600">
                  <tr>
                    <th className="px-5 py-3">#</th>
                    <th className="px-5 py-3">Title</th>
                    <th className="px-5 py-3">Student Name</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Department</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints.map((complaint, index) => (
                    <tr key={complaint.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 text-slate-500 font-medium">{index + 1}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900">{complaint.title}</td>
                      <td className="px-5 py-3.5 text-slate-700">{complaint.student_name}</td>
                      <td className="px-5 py-3.5 text-slate-600">{complaint.category || 'N/A'}</td>
                      <td className="px-5 py-3.5 text-slate-600">{complaint.dept_name || 'N/A'}</td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs">
                        {new Date(complaint.created_at || complaint.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                          {getStatusLabel(complaint.status)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleViewComplaint(complaint.id)}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail & Update Status Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-7 relative">
            <button
              onClick={() => setSelectedComplaint(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
              Complaint Detail & Status Update
            </h3>

            {/* Student Info Box */}
            <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200 text-xs sm:text-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Student Info</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-400 block text-xs">Name</span>
                  <span className="font-semibold text-slate-800">{selectedComplaint.student_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Email</span>
                  <span className="font-semibold text-slate-800">{selectedComplaint.student_email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Phone</span>
                  <span className="font-semibold text-slate-800">{selectedComplaint.student_phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Complaint Info */}
            <div className="mb-4 text-xs sm:text-sm space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-400 block text-xs">Category</span>
                  <span className="font-semibold text-slate-800">{selectedComplaint.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Department</span>
                  <span className="font-semibold text-slate-800">{selectedComplaint.dept_name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Date</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(selectedComplaint.created_at || selectedComplaint.submitted_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-xs mb-1">Description</span>
                <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedComplaint.description}
                </p>
              </div>
            </div>

            {/* Status History */}
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Status Timeline</p>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {selectedComplaint.status_history?.length > 0 ? (
                  selectedComplaint.status_history.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${getStatusColor(item.status.toLowerCase().replace(/\s+/g, '_'))}`}>
                        {item.status}
                      </span>
                      <span className="text-slate-600 flex-1 px-3 truncate">{item.remarks || 'No remarks'}</span>
                      <span className="text-slate-400">{new Date(item.updated_at).toLocaleDateString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No status updates recorded.</p>
                )}
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleUpdateStatus} className="border-t border-slate-200 pt-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Update Complaint Status</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Pending', value: 'pending' },
                  { label: 'In Progress', value: 'in_progress' },
                  { label: 'Resolved', value: 'resolved' },
                  { label: 'Rejected', value: 'rejected' }
                ].map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => setUpdateStatusValue(status.value)}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold transition border ${
                      updateStatusValue === status.value
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Remarks / Resolution Notes</label>
                <textarea
                  value={updateRemarks}
                  onChange={(e) => setUpdateRemarks(e.target.value)}
                  placeholder="Add details about status change..."
                  rows="3"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={updating || !updateStatusValue}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white transition ${
                  submitStatus === 'success'
                    ? 'bg-emerald-600'
                    : submitStatus === 'error'
                    ? 'bg-red-600'
                    : updating
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                }`}
              >
                {submitStatus === 'success'
                  ? '✓ Status Updated!'
                  : submitStatus === 'error'
                  ? '✗ Update Failed'
                  : updating
                  ? 'Updating Status...'
                  : 'Confirm Status Update'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
