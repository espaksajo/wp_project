import { memo } from 'react';
import { formatPrice } from '../utils/helpers';

const Seat = memo(({ seat, isSelected, onSelect }) => {
  const handleClick = () => {
    if (seat.status === 'available' || isSelected) {
      onSelect(seat._id);
    }
  };

  const getClassName = () => {
    if (isSelected) return 'seat-selected';
    if (seat.status === 'available') return 'seat-available';
    if (seat.status === 'reserved') return 'seat-reserved';
    if (seat.status === 'booked') return 'seat-booked';
    return 'seat-available';
  };

  const priceLabel = seat.price ? formatPrice(seat.price) : '';

  return (
    <button
      className={`w-4 h-4 rounded-[2px] ${getClassName()}`}
      onClick={handleClick}
      disabled={seat.status === 'reserved' || seat.status === 'booked'}
      title={`${seat.seatNumber}${priceLabel ? ' · ' + priceLabel : ''}`}
    />
  );
});

Seat.displayName = 'Seat';

export default Seat;
