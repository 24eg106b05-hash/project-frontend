import { Link } from 'react-router-dom';
import { formatRent, typeLabel } from '../utils.js';

export default function RoomCard({ room }) {
  return (
    <article className="room-card">
      <div className="plate" aria-label={`Room ${room.roomNumber}`}>{room.roomNumber}</div>
      <div className="room-card-body">
        <h3>{room.location}</h3>
        <p className="muted">{typeLabel(room.roomType)}</p>
        <p className="rent">
          {formatRent(room.rent)}
          <span className="muted"> / month</span>
        </p>
      </div>
      <div className="room-card-actions">
        <Link className="btn btn-quiet" to={`/rooms/${room.id}`}>View details</Link>
        <Link className="btn" to={`/rooms/${room.id}/book`}>Book room</Link>
      </div>
    </article>
  );
}
