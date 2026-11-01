import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/helpers';

const EventCard = ({ event }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/events/${event._id}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.name}
            className={`w-full aspect-[3/4] object-cover transition-transform duration-500 ${
              hovered ? 'scale-[1.03]' : 'scale-100'
            }`}
          />
        ) : (
          <div className={`w-full aspect-[3/4] bg-gradient-to-br from-[#FF3B5C]/40 to-[#1A1A1A] flex items-center justify-center transition-transform duration-500 ${hovered ? 'scale-[1.03]' : 'scale-100'}`}>
            <span className="text-white/30 text-5xl">🎭</span>
          </div>
        )}
        {event.category && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full">
            {event.category}
          </span>
        )}
      </div>
      
      <div className="mt-3 space-y-1">
        <h3 className="text-[#1A1A1A] font-medium text-base leading-tight tracking-tight">
          {event.name}
        </h3>
        <p className="text-[#888888] text-sm">
          {event.venue}
        </p>
        <p className="text-[#888888] text-sm">
          {formatDate(event.date)}
        </p>
        {event.ticketPrice && (
          <p className="text-[#FF3B5C] text-sm font-semibold">
            ₹{event.ticketPrice.toLocaleString('en-IN')} / seat
          </p>
        )}
        
        <div
          className={`overflow-hidden transition-all duration-300 ${
            hovered ? 'max-h-8 opacity-100 mt-1' : 'max-h-0 opacity-0'
          }`}
        >
          <span className="text-[#FF3B5C] text-sm font-medium">
            View Seats &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
