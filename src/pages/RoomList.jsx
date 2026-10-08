import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import RoomCard from '../components/RoomCard.jsx';
import { CURRENCY, ROOM_TYPES } from '../utils.js';

const EMPTY = { location: '', minRent: '', maxRent: '', roomType: '' };

export default function RoomList({ showFilters }) {
  const [filters, setFilters] = useState(EMPTY);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (f) => {
    setLoading(true);
    setError('');
    try {
      setRooms(await api.listRooms(f));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(EMPTY);
  }, [load]);

  const set = (field) => (e) => setFilters({ ...filters, [field]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    load(filters);
  };

  const clear = () => {
    setFilters(EMPTY);
    load(EMPTY);
  };

  return (
    <>
      <h1>{showFilters ? 'Search rooms' : 'Available rooms'}</h1>

      {showFilters && (
        <form className="filters" onSubmit={submit}>
          <div className="field">
            <label htmlFor="f-location">Location</label>
            <input id="f-location" value={filters.location} onChange={set('location')} placeholder="e.g. Madhapur" />
          </div>
          <div className="field">
            <label htmlFor="f-min">Rent from ({CURRENCY})</label>
            <input id="f-min" type="number" min="0" value={filters.minRent} onChange={set('minRent')} />
          </div>
          <div className="field">
            <label htmlFor="f-max">Rent up to ({CURRENCY})</label>
            <input id="f-max" type="number" min="0" value={filters.maxRent} onChange={set('maxRent')} />
          </div>
          <div className="field">
            <label htmlFor="f-type">Room type</label>
            <select id="f-type" value={filters.roomType} onChange={set('roomType')}>
              <option value="">Any type</option>
              {ROOM_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="filter-actions">
            <button className="btn">Search</button>
            <button type="button" className="btn btn-quiet" onClick={clear}>Clear</button>
          </div>
        </form>
      )}

      {error && <p className="error" role="alert">{error}</p>}
      {loading && <p className="muted">Loading rooms…</p>}
      {!loading && !error && rooms.length === 0 && (
        <p className="empty">
          {showFilters
            ? 'No rooms match these filters. Try a wider rent range or another location.'
            : 'No rooms are available right now. Owners can list one from Add room.'}
        </p>
      )}

      <div className="grid">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </>
  );
}
