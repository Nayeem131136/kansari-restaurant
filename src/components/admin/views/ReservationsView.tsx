import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { Reservation, ReservationStatus } from '../../../types/admin';
import { 
  Search, 
  Download, 
  RefreshCw, 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Eye, 
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface ReservationsViewProps {
  initialStatusFilter?: string;
}

export function ReservationsView({ initialStatusFilter }: ReservationsViewProps) {
  const { success, error } = useToast();
  
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter || 'ALL');
  const [timeframeFilter, setTimeframeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getAdminReservations({
        search,
        status: statusFilter,
        timeframe: timeframeFilter,
        sortBy
      });
      setReservations(res.reservations);
    } catch (err: any) {
      error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, timeframeFilter, sortBy, error]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleStatusChange = async (id: string, newStatus: ReservationStatus) => {
    try {
      const res = await api.updateReservationStatus(id, newStatus);
      success(`Reservation status updated to ${newStatus}`);
      setReservations(prev => prev.map(r => r.id === id ? res.reservation : r));
      if (selectedRes && selectedRes.id === id) {
        setSelectedRes(res.reservation);
      }
    } catch (err: any) {
      error(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteReservation(id);
      success('Reservation deleted successfully');
      setReservations(prev => prev.filter(r => r.id !== id));
      if (selectedRes && selectedRes.id === id) {
        setSelectedRes(null);
      }
      setDeleteConfirmId(null);
    } catch (err: any) {
      error(err.message || 'Failed to delete reservation');
    }
  };

  const cleanPhoneForWa = (phone: string) => {
    return phone.replace(/[^0-9]/g, '');
  };

  const getWaLink = (res: Reservation) => {
    const cleanPhone = cleanPhoneForWa(res.phone);
    const message = encodeURIComponent(
      `Hello ${res.customerName}, Greetings from KANSARI Restaurant Dhaka!\n\nThis is regarding your table reservation for ${res.guests} guests on ${res.date} at ${res.time}.\n\nStatus: ${res.status}\n\nWe look forward to welcoming you to authentic Bangali dining. For any queries, please let us know.`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-100">
            Table Reservations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage customer booking requests, assign tables, update statuses, and communicate.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchReservations}
            disabled={loading}
            className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 transition-colors cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <a
            href={api.getExportCsvUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
        
        {/* Timeframe Quick Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-800/80">
          <span className="text-slate-400 text-[11px] font-medium mr-2 shrink-0">Timeframe:</span>
          {[
            { id: 'all', label: 'All Dates' },
            { id: 'today', label: 'Today' },
            { id: 'tomorrow', label: 'Tomorrow' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'past', label: 'Past Records' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTimeframeFilter(tab.id)}
              className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                timeframeFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
          
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, phone number, or notes..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="NO_SHOW">NO_SHOW</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="newest">Created: Newest First</option>
              <option value="oldest">Created: Oldest First</option>
              <option value="reservation_date">Reservation Date & Time</option>
              <option value="guests_desc">Guest Count (High to Low)</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Reservations Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="animate-spin" size={16} />
            <span>Loading reservations from database...</span>
          </div>
        ) : reservations.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs space-y-2">
            <p className="text-sm font-medium text-slate-300">No reservations found</p>
            <p>Try adjusting your search query, status filters, or timeframe.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-medium text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4">Guests</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Special Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {reservations.map((res) => {
                  return (
                    <tr 
                      key={res.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Customer Info */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-100 text-sm">
                          {res.customerName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <a
                            href={`tel:${res.phone}`}
                            className="text-slate-400 hover:text-amber-400 font-mono transition-colors flex items-center gap-1"
                          >
                            <Phone size={11} />
                            {res.phone}
                          </a>
                          <a
                            href={getWaLink(res)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400/80 hover:text-emerald-300 transition-colors"
                            title="Message on WhatsApp"
                          >
                            <MessageSquare size={12} />
                          </a>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                          <Calendar size={13} className="text-amber-400" />
                          <span>{res.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] mt-0.5">
                          <Clock size={11} />
                          <span>{res.time}</span>
                        </div>
                      </td>

                      {/* Guests */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono font-medium text-slate-200">
                          <Users size={13} className="text-blue-400" />
                          <span>{res.guests} Person{res.guests > 1 ? 's' : ''}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="inline-block relative">
                          <select
                            value={res.status}
                            onChange={(e) => handleStatusChange(res.id, e.target.value as ReservationStatus)}
                            className={`py-1 pl-2.5 pr-6 rounded-full text-[11px] font-semibold uppercase tracking-wider border appearance-none cursor-pointer focus:outline-none ${
                              res.status === 'CONFIRMED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : res.status === 'PENDING'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                : res.status === 'COMPLETED'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                : res.status === 'CANCELLED'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            <option value="PENDING" className="bg-slate-900 text-amber-400">PENDING</option>
                            <option value="CONFIRMED" className="bg-slate-900 text-emerald-400">CONFIRMED</option>
                            <option value="COMPLETED" className="bg-slate-900 text-blue-400">COMPLETED</option>
                            <option value="CANCELLED" className="bg-slate-900 text-rose-400">CANCELLED</option>
                            <option value="NO_SHOW" className="bg-slate-900 text-slate-400">NO_SHOW</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                        </div>
                      </td>

                      {/* Notes */}
                      <td className="py-3 px-4 max-w-xs truncate text-slate-400">
                        {res.notes ? (
                          <span title={res.notes}>{res.notes}</span>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedRes(res)}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 transition-colors cursor-pointer"
                            title="View Full Booking Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(res.id)}
                            className="p-1.5 rounded bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete Reservation"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Slide-over / Modal Detail View */}
      {selectedRes && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-100 text-base">
                  Booking Request Details
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  ID: {selectedRes.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedRes(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs sm:text-sm">
              
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Customer Name</span>
                  <span className="font-semibold text-slate-100 text-sm block">
                    {selectedRes.customerName}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Phone Number</span>
                  <a
                    href={`tel:${selectedRes.phone}`}
                    className="font-mono font-medium text-amber-400 hover:underline block"
                  >
                    {selectedRes.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Reserved Date</span>
                  <span className="font-medium text-slate-200 block">
                    {selectedRes.date}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Dining Time</span>
                  <span className="font-mono font-medium text-slate-200 block">
                    {selectedRes.time}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Guest Size</span>
                  <span className="font-medium text-slate-200 block">
                    {selectedRes.guests} Guests
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Current Status</span>
                  <span className="font-semibold uppercase tracking-wider text-xs">
                    {selectedRes.status}
                  </span>
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
                  Customer Special Requests & Notes:
                </span>
                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-300 text-xs leading-relaxed italic">
                  {selectedRes.notes || 'No special dietary or seating requests provided by the customer.'}
                </div>
              </div>

              {/* Contact Shortcuts */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={`tel:${selectedRes.phone}`}
                  className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Phone size={14} className="text-amber-400" />
                  <span>Call Customer</span>
                </a>
                <a
                  href={getWaLink(selectedRes)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-medium text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp Message</span>
                </a>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                  Update Reservation Status:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedRes.id, 'CONFIRMED')}
                    className="py-2 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold cursor-pointer"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedRes.id, 'COMPLETED')}
                    className="py-2 px-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold cursor-pointer"
                  >
                    Seat / Complete
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedRes.id, 'CANCELLED')}
                    className="py-2 px-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
              <span>Booked on: {new Date(selectedRes.createdAt).toLocaleString()}</span>
              <button
                onClick={() => setSelectedRes(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-5 space-y-4">
            <h4 className="font-semibold text-slate-100 text-sm">
              Confirm Reservation Deletion
            </h4>
            <p className="text-xs text-slate-400">
              Are you sure you want to permanently remove this booking record? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-slate-100 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold cursor-pointer shadow-md shadow-rose-500/20"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
