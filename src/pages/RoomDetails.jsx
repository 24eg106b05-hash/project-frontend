import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { formatRent, typeLabel } from '../utils.js';

export default function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getRoom(id).then(setRoom).catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="error" role="alert">{error}</p>;
  if (!room) return <p className="muted">Loading room…</p>;

  return (
    <section className="panel details">
      <div className="plate plate-lg" aria-label={`Room ${room.roomNumber}`}>{room.roomNumber}</div>
      <div>
        <h1>{room.location}</h1>
        <p className="rent big">
          {formatRent(room.rent)}
          <span className="muted"> / month</span>
        </p>
        <p>{room.description || 'The owner has not added a description yet.'}</p>

        <dl className="facts">
          <dt>Room type</dt>
          <dd>{typeLabel(room.roomType)}</dd>
          <dt>Status</dt>
          <dd>
            <span className={room.available ? 'tag tag-ok' : 'tag tag-off'}>
              {room.available ? 'Available' : 'Not available'}
            </span>
          </dd>
          <dt>Owner</dt>
          <dd>{room.owner.name}</dd>
          <dt>Contact</dt>
          <dd>{room.owner.phone} · {room.owner.email}</dd>
        </dl>

        {room.available ? (
          <Link className="btn" to={`/rooms/${room.id}/book`}>Book this room</Link>
        ) : (
          <p className="muted">This room cannot be booked right now.</p>
        )}
      </div>
    </section>
  );
}
