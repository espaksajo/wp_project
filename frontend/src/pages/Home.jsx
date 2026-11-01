import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import EventCard from '../components/EventCard';
import api from '../api/axiosConfig';



const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data.events);
      } catch {
        toast.error('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F4F2]">
      <Toaster position="top-right" />

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-[8vw] md:text-[6vw] lg:text-[5vw] font-bold text-[#1A1A1A] leading-[1.1] tracking-[-0.02em] text-center">
            Discover the scene.
          </h1>

          <div className="mt-10 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search events, venues, artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-0 py-4 bg-transparent border-b border-[#1A1A1A] text-[#1A1A1A] text-lg placeholder:text-[#888888] focus:outline-none focus:border-[#FF3B5C] transition-colors"
            />
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}

          {!loading && filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[#888888] text-lg">No events found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
