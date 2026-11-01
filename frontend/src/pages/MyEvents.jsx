import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, formatPrice } from '../utils/helpers';
import api from '../api/axiosConfig';

const MyEvents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyEvents = async () => {
      try {
        const res = await api.get(`/users/${user._id}/events`);
        setEvents(res.data.events || []);
      } catch (error) {
        toast.error('Failed to load your events');
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [user, navigate]);

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(eventId);
    try {
      await api.delete(`/events/${eventId}`);
      setEvents(prev => prev.filter(e => e._id !== eventId));
      toast.success('Event deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />

      <div className="max-w-5xl mx-auto px-6 py-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">My Events</h1>
            <p className="text-[#666666]">Events you have listed on the platform</p>
          </div>
          <button
            onClick={() => navigate('/create-event')}
            className="px-6 py-3 bg-[#FF3B5C] text-white font-medium rounded-lg hover:bg-[#e63354] transition-colors shrink-0"
          >
            + List New Event
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5">
            <div className="text-6xl mb-6">🎪</div>
            <h2 className="text-white text-2xl font-semibold mb-3">You haven't listed any events</h2>
            <p className="text-[#666666] mb-8">Host your first event and start selling tickets today!</p>
            <button
              onClick={() => navigate('/create-event')}
              className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Create an Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event._id} className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors flex flex-col">
                <div className="relative h-48">
                  {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#FF3B5C]/30 to-[#1A1A1A] flex items-center justify-center">
                      <span className="text-4xl">🎭</span>
                    </div>
                  )}
                  {event.category && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full">
                      {event.category}
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-white font-semibold text-lg leading-tight mb-1">{event.name}</h3>
                  <p className="text-[#888888] text-sm mb-3 truncate">{event.venue}</p>
                  
                  <div className="space-y-2 mb-6 mt-auto">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#666666]">Date</span>
                      <span className="text-[#cccccc]">{formatDateTime(event.date)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#666666]">Price</span>
                      <span className="text-[#00D26A] font-medium">{formatPrice(event.ticketPrice || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#666666]">Capacity</span>
                      <span className="text-[#cccccc]">{event.totalSeats} seats</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <Link
                      to={`/events/${event._id}`}
                      className="flex-1 py-2 text-center bg-white/10 text-white text-sm font-medium rounded hover:bg-white/20 transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(event._id)}
                      disabled={deleteLoading === event._id}
                      className="flex-1 py-2 text-center border border-[#FF3B5C]/50 text-[#FF3B5C] text-sm font-medium rounded hover:bg-[#FF3B5C] hover:text-white transition-colors disabled:opacity-50"
                    >
                      {deleteLoading === event._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
