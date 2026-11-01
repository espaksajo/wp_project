import { memo, useMemo } from 'react';
import Seat from './Seat';

const SeatGrid = memo(({ seats, selectedSeats, onSeatSelect }) => {
  // Parse seatNumber like "A1", "A12", "L12" into row (letter) and column (number)
  const parsedSeats = useMemo(() => {
    return seats.map(seat => {
      const match = seat.seatNumber.match(/^([A-Z]+)(\d+)$/);
      return {
        ...seat,
        _row: match ? match[1] : seat.seatNumber[0],
        _col: match ? parseInt(match[2]) : 0,
      };
    });
  }, [seats]);

  const rows = useMemo(() => {
    return [...new Set(parsedSeats.map(s => s._row))].sort();
  }, [parsedSeats]);

  return (
    <div className="flex flex-col items-center gap-3 overflow-x-auto py-4">
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-gradient-to-b from-[#FF3B5C]/20 to-transparent h-2 rounded-full mb-6 mx-8" />
        <p className="text-center text-[#666666] text-xs uppercase tracking-widest mb-6">
          Stage
        </p>
      </div>

      <div className="flex flex-col gap-[5px]">
        {rows.map(row => {
          const rowSeats = parsedSeats
            .filter(s => s._row === row)
            .sort((a, b) => a._col - b._col);

          return (
            <div key={row} className="flex items-center gap-[5px]">
              <span className="w-5 text-right text-[#666666] text-[10px] font-mono mr-1 shrink-0">
                {row}
              </span>
              <div className="flex gap-[5px]">
                {rowSeats.map(seat => (
                  <Seat
                    key={seat._id}
                    seat={seat}
                    isSelected={selectedSeats.includes(seat._id)}
                    onSelect={onSeatSelect}
                  />
                ))}
              </div>
              <span className="w-5 text-left text-[#666666] text-[10px] font-mono ml-1 shrink-0">
                {row}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-6 mt-6 text-xs text-[#666666]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-[2px] seat-available" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-[2px] seat-selected" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-[2px] seat-reserved" />
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-[2px] seat-booked" />
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
});

SeatGrid.displayName = 'SeatGrid';

export default SeatGrid;
