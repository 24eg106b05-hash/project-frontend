import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import OwnerGate from '../components/OwnerGate.jsx';
import { useOwner } from '../OwnerContext.jsx';
import { formatDate, formatRent, typeLabel } from '../utils.js';

function Dashboard() {
  const { owner, selectOwner } = useOwner();
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [r, b] = await Promise.all([
        api.listRooms({ ownerId: owner.id, availableOnly: false }),
        api.ownerBookings(owner.id),
      ]);
      setRooms(r);
      setBookings(b);
    } catch (err) {
      setError(err.message);
    }
  }, [owner.id]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (action) => {
    setError('');
    try {
      await action();
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = (room) => {
    if (window.confirm(`Delete room ${room.roomNumber}? This cannot be undone.`)) {
      run(() => api.deleteRoom(room.id));
    }
  };

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>{owner.name}</h1>
          <p className="muted">{owner.email} · {owner.phone}</p>
        </div>
        <div className="dash-actions">
          <Link className="btn" to="/rooms/new">Add room</Link>
          <button className="btn btn-quiet" onClick={() => selectOwner(null)}>Switch owner</button>
        </div>
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      <h2>Your rooms</h2>
      {rooms.length === 0 ? (
        <p className="empty">You have not listed any rooms yet. Use Add room to list your first one.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Room</th><th>Location</th><th>Type</th><th>Rent</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td><strong>{room.roomNumber}</strong></td>
                  <td>{room.location}</td>
                  <td>{typeLabel(room.roomType)}</td>
                  <td>{formatRent(room.rent)}</td>
                  <td>
                    <span className={room.available ? 'tag tag-ok' : 'tag tag-off'}>
                      {room.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="link" onClick={() => run(() => api.setAvailability(room.id, !room.available))}>
                      {room.available ? 'Mark unavailable' : 'Mark available'}
                    </button>
                    <Link className="link" to={`/rooms/${room.id}/edit`}>Edit</Link>
                    <button className="link danger" onClick={() => remove(room)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2>Bookings</h2>
      {bookings.length === 0 ? (
        <p className="empty">No bookings yet. They appear here when a tenant books one of your rooms.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Room</th><th>Tenant</th><th>Contact</th><th>Dates</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td><strong>{b.room.roomNumber}</strong></td>
                  <td>{b.tenant.name}</td>
                  <td>{b.tenant.phone}<br /><span className="muted">{b.tenant.email}</span></td>
                  <td>{formatDate(b.startDate)} to {formatDate(b.endDate)}</td>
                  <td>
                    <span className={b.status === 'ACTIVE' ? 'tag tag-ok' : 'tag tag-off'}>
                      {b.status === 'ACTIVE' ? 'Active' : 'Cancelled'}
                    </span>
                  </td>
                  <td className="actions">
                    {b.status === 'ACTIVE' && (
                      <button className="link danger" onClick={() => run(() => api.cancelBooking(b.id))}>
                        Cancel booking
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function OwnerDashboard() {
  return (
    <OwnerGate>
      <Dashboard />
    </OwnerGate>
  );
}
