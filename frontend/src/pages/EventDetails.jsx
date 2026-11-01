import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import SeatGrid from '../components/SeatGrid';
import CountdownTimer from '../components/CountdownTimer';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, formatPrice } from '../utils/helpers';
import api from '../api/axiosConfig';

// ─── Receipt Modal ────────────────────────────────────────────────────────────
const ReceiptModal = ({ receipt, onClose, onGoToBookings }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
    <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
      <div className="bg-gradient-to-r from-[#00D26A]/20 to-[#00D26A]/5 px-6 py-5 border-b border-white/10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#00D26A] flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-white font-bold text-xl">Booking Confirmed!</h2>
          <p className="text-[#00D26A] text-sm">Payment successful</p>
        </div>
      </div>

      <div className="px-6 py-5 space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#888888]">Event</span>
            <span className="text-white font-medium text-right max-w-[60%]">{receipt.eventName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#888888]">Venue</span>
            <span className="text-white text-right max-w-[60%]">{receipt.venue}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#888888]">Date</span>
            <span className="text-white">{receipt.date}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#888888]">Seats</span>
            <span className="text-white font-mono">{receipt.seats.join(', ')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#888888]">Price per seat</span>
            <span className="text-white">{receipt.pricePerSeat}</span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 flex justify-between items-center">
          <span className="text-white font-semibold">Total Paid</span>
          <span className="text-[#00D26A] font-bold text-2xl">{receipt.total}</span>
        </div>

        <div className="bg-white/5 rounded-lg px-4 py-3 text-center">
          <p className="text-[#666666] text-xs">Booking ID</p>
          <p className="text-white font-mono text-sm mt-0.5">{receipt.bookingId}</p>
        </div>
      </div>

      <div className="px-6 pb-6 flex gap-3">
        <button
          onClick={onGoToBookings}
          className="flex-1 py-3 bg-[#FF3B5C] text-white font-medium rounded-lg hover:bg-[#e63354] transition-colors"
        >
          My Bookings
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/15 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservationActive, setReservationActive] = useState(false);
  const [reservationExpiry, setReservationExpiry] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [paymentErrors, setPaymentErrors] = useState({});

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data.event);
        // Normalise seat IDs to strings for reliable comparison
        const rawSeats = response.data.seats.map(s => ({ ...s, _id: s._id.toString() }));
        setSeats(rawSeats);
      } catch {
        toast.error('Failed to load event details.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  const handleSeatSelect = useCallback((seatId) => {
    if (reservationActive) return;
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) return prev.filter(s => s !== seatId);
      if (prev.length >= 6) { toast.error('Maximum 6 seats per reservation'); return prev; }
      return [...prev, seatId];
    });
  }, [reservationActive]);

  // Format card number with spaces
  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // Format expiry MM/YY
  const handleExpiryChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) setCardExpiry(val.slice(0, 2) + '/' + val.slice(2));
    else setCardExpiry(val);
  };

  const validatePayment = () => {
    const errors = {};
    if (cardNumber.replace(/\s/g, '').length < 16) errors.cardNumber = 'Enter a valid 16-digit card number';
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) errors.cardExpiry = 'Enter a valid expiry (MM/YY)';
    if (cardCvc.length < 3) errors.cardCvc = 'Enter a valid 3-digit CVC';
    if (cardName.trim().length < 2) errors.cardName = 'Enter the name on your card';
    if (!termsAccepted) errors.terms = 'You must accept the terms to continue';
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReserve = async () => {
    if (!user) { toast.error('Please login to reserve seats'); navigate('/login'); return; }
    if (selectedSeats.length === 0) { toast.error('Please select at least one seat'); return; }
    setActionLoading(true);
    try {
      const seatNumbers = seats.filter(s => selectedSeats.includes(s._id)).map(s => s.seatNumber);
      await api.post('/reserve', { eventId: id, seatNumbers });
      setSeats(prev => prev.map(s => selectedSeats.includes(s._id) ? { ...s, status: 'reserved' } : s));
      setReservationActive(true);
      setReservationExpiry(Date.now() + 5 * 60 * 1000);
      toast.success('Seats reserved! Complete payment within 5 minutes.');
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error(error.response?.data?.message || 'Seat became unavailable');
        setSelectedSeats([]);
      } else {
        toast.error('Failed to reserve seats. Please try again later.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!validatePayment()) return;

    setActionLoading(true);
    const selectedSeatData = seats.filter(s => selectedSeats.includes(s._id));
    const seatNumbers = selectedSeatData.map(s => s.seatNumber);

    try {
      await api.post('/bookings', { eventId: id, seatNumbers });
      setSeats(prev => prev.map(s => selectedSeats.includes(s._id) ? { ...s, status: 'booked' } : s));
      buildAndShowReceipt(selectedSeatData, seatNumbers);
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 400) {
        toast.error('Reservation expired. Please select seats again.');
        setReservationActive(false); setReservationExpiry(null); setSelectedSeats([]);
        try { const r = await api.get(`/events/${id}`); setSeats(r.data.seats.map(s => ({ ...s, _id: s._id.toString() }))); }
        catch { /* ignore */ }
      } else if (error.response?.status === 409) {
        toast.error(error.response?.data?.message || 'Seat became unavailable');
        setReservationActive(false); setReservationExpiry(null); setSelectedSeats([]);
      } else {
        toast.error('Failed to complete booking. Please try again.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const buildAndShowReceipt = (selectedSeatData, seatNumbers) => {
    const pricePerSeat = event?.ticketPrice || selectedSeatData[0]?.price || 0;
    const totalPrice = selectedSeatData.reduce(
      (sum, s) => sum + (s.price || event?.ticketPrice || 0),
      0
    );

    setReceipt({
      eventName: event?.name,
      venue: event?.venue,
      date: formatDateTime(event?.date),
      seats: seatNumbers,
      pricePerSeat: formatPrice(pricePerSeat),
      total: formatPrice(totalPrice),
      bookingId: `BKG-${Date.now().toString(36).toUpperCase()}`,
    });
    setReservationActive(false);
    setReservationExpiry(null);

    // Store booking locally for My Bookings fallback
    const existing = JSON.parse(localStorage.getItem('myBookings') || '[]');
    existing.unshift({
      _id: `local-${Date.now()}`,
      bookingId: `BKG-${Date.now().toString(36).toUpperCase()}`,
      eventId: {
        name: event?.name,
        venue: event?.venue,
        date: event?.date,
        imageUrl: event?.imageUrl,
        category: event?.category,
      },
      seatNumbers,
      totalAmount: selectedSeatData.reduce((sum, s) => sum + (s.price || event?.ticketPrice || 0), 0),
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('myBookings', JSON.stringify(existing));
  };

  const handleExpire = useCallback(() => {
    toast.error('Reservation expired!');
    setReservationActive(false); setReservationExpiry(null); setSelectedSeats([]);
    // Refresh seat status from server if possible
    api.get(`/events/${id}`).then(r => setSeats(r.data.seats.map(s => ({ ...s, _id: s._id.toString() })))).catch(() => {});
  }, [id]);

  const selectedSeatData = seats.filter(s => selectedSeats.includes(s._id));
  const totalPrice = selectedSeatData.reduce(
    (sum, s) => sum + (s.price || event?.ticketPrice || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] relative">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />

      {receipt && (
        <ReceiptModal
          receipt={receipt}
          onClose={() => { setReceipt(null); setSelectedSeats([]); }}
          onGoToBookings={() => navigate('/my-bookings')}
        />
      )}

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* ── Left: Event Info + Grid ── */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                {event?.imageUrl && (
                  <img src={event.imageUrl} alt={event?.name} className="w-full h-56 object-cover rounded-xl mb-6" />
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-[-0.02em] mb-3">{event?.name}</h1>
                <p className="text-[#666666] text-lg mb-1">{event?.venue}</p>
                <p className="text-[#666666] mb-2">{formatDateTime(event?.date)}</p>
                {event?.ticketPrice > 0 && (
                  <p className="text-[#FF3B5C] font-semibold text-lg">{formatPrice(event.ticketPrice)} per seat</p>
                )}
                {event?.description && (
                  <p className="text-[#888888] text-sm mt-4 leading-relaxed">{event.description}</p>
                )}
              </div>

              <div className="glass-panel rounded-lg p-4 mb-8 overflow-x-auto">
                <SeatGrid seats={seats} selectedSeats={selectedSeats} onSeatSelect={handleSeatSelect} />
              </div>
            </div>

            {/* ── Right: Booking Panel ── */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-28 space-y-6">

                {reservationActive && reservationExpiry && (
                  <div className="glass-panel rounded-lg p-6">
                    <CountdownTimer targetTime={reservationExpiry} onExpire={handleExpire} />
                  </div>
                )}

                <div className="glass-panel rounded-lg p-6">
                  <h3 className="text-white font-medium text-lg mb-4">Your Selection</h3>

                  {selectedSeatData.length === 0 ? (
                    <p className="text-[#666666] text-sm">Click on available seats to select them.</p>
                  ) : (
                    <div className="space-y-2 mb-6">
                      {selectedSeatData.map(seat => (
                        <div key={seat._id} className="flex justify-between items-center">
                          <span className="text-white text-sm font-mono">Seat {seat.seatNumber}</span>
                          <span className="text-[#888888] text-sm">{formatPrice(seat.price || event?.ticketPrice || 0)}</span>
                        </div>
                      ))}
                      <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                        <span className="text-white font-medium">Total</span>
                        <span className="text-white font-bold text-lg">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  )}

                  {!reservationActive ? (
                    <button
                      onClick={handleReserve}
                      disabled={selectedSeats.length === 0 || actionLoading}
                      className={`w-full py-3 rounded font-medium transition-all btn-lift ${
                        selectedSeats.length > 0 && !actionLoading
                          ? 'bg-[#FF3B5C] text-white hover:bg-[#e63354]'
                          : 'bg-white/10 text-[#666666] cursor-not-allowed'
                      }`}
                    >
                      {actionLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Reserving...
                        </span>
                      ) : (
                        `Reserve ${selectedSeats.length > 0 ? `(${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''})` : ''}`
                      )}
                    </button>
                  ) : (
                    /* ── Payment Form ── */
                    <div className="space-y-4">
                      <h4 className="text-white text-sm font-medium flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#FF3B5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Payment Details
                      </h4>

                      {/* Card Number */}
                      <div>
                        <input
                          type="text"
                          placeholder="Card Number *"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          maxLength={19}
                          className={`w-full bg-black/40 border rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none transition-colors placeholder:text-[#555] ${paymentErrors.cardNumber ? 'border-[#FF3B5C]' : 'border-white/10 focus:border-[#FF3B5C]'}`}
                        />
                        {paymentErrors.cardNumber && <p className="text-[#FF3B5C] text-xs mt-1">{paymentErrors.cardNumber}</p>}
                      </div>

                      {/* Expiry + CVC */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            placeholder="MM/YY *"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            maxLength={5}
                            className={`w-full bg-black/40 border rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none transition-colors placeholder:text-[#555] ${paymentErrors.cardExpiry ? 'border-[#FF3B5C]' : 'border-white/10 focus:border-[#FF3B5C]'}`}
                          />
                          {paymentErrors.cardExpiry && <p className="text-[#FF3B5C] text-xs mt-1">{paymentErrors.cardExpiry}</p>}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="CVC *"
                            value={cardCvc}
                            onChange={e => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            maxLength={3}
                            className={`w-full bg-black/40 border rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none transition-colors placeholder:text-[#555] ${paymentErrors.cardCvc ? 'border-[#FF3B5C]' : 'border-white/10 focus:border-[#FF3B5C]'}`}
                          />
                          {paymentErrors.cardCvc && <p className="text-[#FF3B5C] text-xs mt-1">{paymentErrors.cardCvc}</p>}
                        </div>
                      </div>

                      {/* Cardholder Name */}
                      <div>
                        <input
                          type="text"
                          placeholder="Name on Card *"
                          value={cardName}
                          onChange={e => setCardName(e.target.value)}
                          className={`w-full bg-black/40 border rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none transition-colors placeholder:text-[#555] ${paymentErrors.cardName ? 'border-[#FF3B5C]' : 'border-white/10 focus:border-[#FF3B5C]'}`}
                        />
                        {paymentErrors.cardName && <p className="text-[#FF3B5C] text-xs mt-1">{paymentErrors.cardName}</p>}
                      </div>

                      {/* Terms */}
                      <div className="pt-1">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={e => setTermsAccepted(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-[#666666] bg-transparent text-[#FF3B5C] focus:ring-[#FF3B5C]"
                          />
                          <span className="text-[#888888] text-sm leading-relaxed">
                            I agree to the terms and conditions. Tickets are non-refundable.
                          </span>
                        </label>
                        {paymentErrors.terms && <p className="text-[#FF3B5C] text-xs mt-1 ml-7">{paymentErrors.terms}</p>}
                      </div>

                      {/* Pay Button */}
                      <button
                        onClick={handleBooking}
                        disabled={actionLoading}
                        className={`w-full py-3 rounded font-medium transition-all btn-lift ${
                          !actionLoading
                            ? 'bg-[#00D26A] text-white hover:bg-[#00b85c]'
                            : 'bg-white/10 text-[#666666] cursor-not-allowed'
                        }`}
                      >
                        {actionLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing Payment...
                          </span>
                        ) : (
                          `Pay ${formatPrice(totalPrice)} & Confirm`
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
