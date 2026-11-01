import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, formatPrice } from '../utils/helpers';
import api from '../api/axiosConfig';

const BookingCard = ({ booking }) => {
  const event = booking.eventId || {};
  const isPast = event.date ? new Date(event.date) < new Date() : false;

  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
      <div className="flex flex-col sm:flex-row">
        {/* Event image */}
        <div className="sm:w-40 shrink-0">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-36 sm:h-full object-cover"
            />
          ) : (
            <div className="w-full h-36 sm:h-full bg-gradient-to-br from-[#FF3B5C]/30 to-[#1A1A1A] flex items-center justify-center">
              <span className="text-4xl">🎭</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-white font-semibold text-lg leading-tight">{event.name || 'Unknown Event'}</h3>
              <p className="text-[#888888] text-sm mt-1">{event.venue || ''}</p>
              {event.date && <p className="text-[#666666] text-sm">{formatDateTime(event.date)}</p>}
            </div>
            <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
              isPast ? 'bg-white/10 text-[#888888]' : 'bg-[#00D26A]/20 text-[#00D26A]'
            }`}>
              {isPast ? 'Past' : 'Upcoming'}
            </span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[#666666] text-xs uppercase tracking-widest mb-2">Seats</p>
              <div className="flex flex-wrap gap-2">
                {(booking.seatNumbers || []).map(seat => (
                  <span key={seat} className="px-2.5 py-1 bg-[#FF3B5C]/10 text-[#FF3B5C] text-xs font-mono rounded-full border border-[#FF3B5C]/20">
                    {seat}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#666666] text-xs uppercase tracking-widest mb-1">Total Paid</p>
              <p className="text-white font-bold text-xl">{formatPrice(booking.totalAmount || 0)}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-[#555555] text-xs font-mono">
              ID: {booking.bookingId || (booking._id || '').slice(-8).toUpperCase()}
            </p>
            <p className="text-[#555555] text-xs">
              {new Date(booking.createdAt || booking.bookedAt || Date.now()).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/my');
        setBookings(res.data.bookings || []);
      } catch {
        // API unavailable — show localStorage bookings only
        const localBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
        setBookings(localBookings);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="max-w-4xl mx-auto px-6 py-28">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">My Bookings</h1>
          <p className="text-[#666666]">Your confirmed ticket purchases</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🎟️</div>
            <h2 className="text-white text-2xl font-semibold mb-3">No bookings yet</h2>
            <p className="text-[#666666] mb-8">Browse events and grab your tickets!</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-[#FF3B5C] text-white font-medium rounded-lg hover:bg-[#e63354] transition-colors"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, i) => (
              <BookingCard key={booking._id || i} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
