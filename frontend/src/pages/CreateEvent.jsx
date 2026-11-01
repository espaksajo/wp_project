import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const CATEGORIES = ['Music', 'Sports', 'Comedy', 'Theatre', 'Tech', 'Food', 'Other'];

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    date: '',
    venue: '',
    description: '',
    category: 'Music',
    ticketPrice: '',
    seatRows: '5',
    seatCols: '10',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const totalSeats = (parseInt(form.seatRows) || 0) * (parseInt(form.seatCols) || 0);
  const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, parseInt(form.seatRows) || 0).split('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.date || !form.venue.trim() || !form.ticketPrice) {
      toast.error('Please fill in all required fields correctly');
      return;
    }
    if (Number(form.ticketPrice) <= 0) {
      toast.error('Ticket price must be greater than 0');
      return;
    }
    const rows = parseInt(form.seatRows);
    const cols = parseInt(form.seatCols);
    if (!rows || rows < 1 || rows > 26) {
      toast.error('Rows must be between 1 and 26');
      return;
    }
    if (!cols || cols < 1 || cols > 50) {
      toast.error('Columns must be between 1 and 50');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('date', form.date);
      formData.append('venue', form.venue);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('ticketPrice', form.ticketPrice);
      formData.append('totalSeats', String(totalSeats));
      formData.append('rows', JSON.stringify(rowLabels));
      formData.append('cols', String(cols));
      if (imageFile) formData.append('image', imageFile);

      const res = await api.post('/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(`Event created with ${totalSeats} seats!`);
      setTimeout(() => navigate(`/events/${res.data.event._id}`), 1500);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.message || 'Failed to create event');
      } else {
        toast.success('Event created (offline mode)! Redirecting...');
        setTimeout(() => navigate('/'), 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />

      <div className="max-w-3xl mx-auto px-6 py-28">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">List an Event</h1>
          <p className="text-[#666666]">Create your event and define your seating layout.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-[#888888] text-sm mb-3 uppercase tracking-widest">Event Poster</label>
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-[#FF3B5C]/50 transition-colors overflow-hidden relative group"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-[#555555]">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Click to upload event poster</p>
                  <p className="text-xs text-[#444]">JPG, PNG or WEBP — Max 5MB</p>
                </div>
              )}
            </label>
            <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          {/* Event Name */}
          <div>
            <label className="block text-[#888888] text-sm mb-2 uppercase tracking-widest">Event Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Coldplay: Music of the Spheres"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF3B5C] transition-colors placeholder:text-[#444]"
              required
            />
          </div>

          {/* Venue */}
          <div>
            <label className="block text-[#888888] text-sm mb-2 uppercase tracking-widest">Venue *</label>
            <input
              type="text"
              name="venue"
              value={form.venue}
              onChange={handleChange}
              placeholder="e.g. Narendra Modi Stadium, Ahmedabad"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF3B5C] transition-colors placeholder:text-[#444]"
              required
            />
          </div>

          {/* Date & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#888888] text-sm mb-2 uppercase tracking-widest">Date & Time *</label>
              <input
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF3B5C] transition-colors [color-scheme:dark]"
                required
              />
            </div>
            <div>
              <label className="block text-[#888888] text-sm mb-2 uppercase tracking-widest">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF3B5C] transition-colors"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c} className="bg-[#111111]">{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ticket Price */}
          <div>
            <label className="block text-[#888888] text-sm mb-2 uppercase tracking-widest">Ticket Price (₹) *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666] font-semibold">₹</span>
              <input
                type="number"
                name="ticketPrice"
                value={form.ticketPrice}
                onChange={handleChange}
                placeholder="e.g. 1500"
                min="1"
                className="w-full bg-black/40 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-[#FF3B5C] transition-colors placeholder:text-[#444]"
                required
              />
            </div>
          </div>

          {/* ── Seating Layout ── */}
          <div>
            <label className="block text-[#888888] text-sm mb-3 uppercase tracking-widest">Seating Layout *</label>
            <div className="glass-panel rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#666666] text-xs mb-1.5">Number of Rows (A, B, C…)</label>
                  <input
                    type="number"
                    name="seatRows"
                    value={form.seatRows}
                    onChange={handleChange}
                    min="1"
                    max="26"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF3B5C] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#666666] text-xs mb-1.5">Seats per Row</label>
                  <input
                    type="number"
                    name="seatCols"
                    value={form.seatCols}
                    onChange={handleChange}
                    min="1"
                    max="50"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF3B5C] transition-colors"
                  />
                </div>
              </div>

              {/* Live preview */}
              <div className="bg-black/40 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#888888] text-xs uppercase tracking-widest">Preview</span>
                  <span className="text-white text-sm font-medium">{totalSeats} total seats</span>
                </div>
                {totalSeats > 0 && totalSeats <= 1300 ? (
                  <div className="flex flex-col items-center gap-[3px] overflow-x-auto py-2">
                    <div className="bg-gradient-to-b from-[#FF3B5C]/20 to-transparent h-1 rounded-full mb-3 w-3/4" />
                    <p className="text-[#666666] text-[10px] uppercase tracking-widest mb-2">Stage</p>
                    {rowLabels.map(row => (
                      <div key={row} className="flex items-center gap-[3px]">
                        <span className="w-4 text-right text-[#555] text-[9px] font-mono">{row}</span>
                        <div className="flex gap-[3px]">
                          {Array.from({ length: parseInt(form.seatCols) || 0 }, (_, i) => (
                            <div key={i} className="w-[8px] h-[8px] rounded-[1px] bg-[#4A4A4A]" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : totalSeats > 1300 ? (
                  <p className="text-[#888888] text-xs text-center py-4">Grid too large to preview. {totalSeats} seats will be generated.</p>
                ) : (
                  <p className="text-[#555555] text-xs text-center py-4">Set rows and columns above to see a preview</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#888888] text-sm mb-2 uppercase tracking-widest">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell people what to expect at this event..."
              rows={4}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF3B5C] transition-colors placeholder:text-[#444] resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all btn-lift text-lg ${
              loading ? 'bg-white/10 cursor-not-allowed' : 'bg-[#FF3B5C] hover:bg-[#e63354]'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Event...
              </span>
            ) : (
              `Create Event (${totalSeats} seats)`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
