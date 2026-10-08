import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { formatDate, formatRent, today, typeLabel } from '../utils.js';

export default function BookRoom() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [form, setForm] = useState({
    tenantName: '',
    tenantEmail: '',
    tenantPhone: '',
    startDate: today(),
    endDate: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    api.getRoom(id).then(setRoom).catch((err) => setError(err.message));
  }, [id]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      setBooking(await api.createBooking({ ...form, roomId: Number(id) }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!room) return error ? <p className="error" role="alert">{error}</p> : <p className="muted">Loading room…</p>;

  if (booking) {
    return (
      <section className="panel narrow">
        <h1>Room booked</h1>
        <p>
          Room {room.roomNumber}, {room.location} is yours from{' '}
          <strong>{formatDate(booking.startDate)}</strong> to <strong>{formatDate(booking.endDate)}</strong>.
        </p>
        <p className="muted">
          Contact {room.owner.name} on {room.owner.phone} to arrange the move-in.
        </p>
        <Link className="btn" to="/">Back to available rooms</Link>
      </section>
    );
  }

  return (
    <section className="panel narrow">
      <h1>Book room {room.roomNumber}</h1>
      <p className="muted">
        {room.location} · {typeLabel(room.roomType)} · {formatRent(room.rent)} / month
      </p>

      {!room.available ? (
        <p className="error" role="alert">This room is not available right now.</p>
      ) : (
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="t-name">Your name</label>
            <input id="t-name" value={form.tenantName} onChange={set('tenantName')} required />
          </div>
          <div className="field">
            <label htmlFor="t-email">Email</label>
            <input id="t-email" type="email" value={form.tenantEmail} onChange={set('tenantEmail')} required />
          </div>
          <div className="field">
            <label htmlFor="t-phone">Phone</label>
            <input id="t-phone" value={form.tenantPhone} onChange={set('tenantPhone')} required />
          </div>
          <div className="row">
            <div className="field">
              <label htmlFor="t-start">Move in</label>
              <input id="t-start" type="date" min={today()} value={form.startDate} onChange={set('startDate')} required />
            </div>
            <div className="field">
              <label htmlFor="t-end">Move out</label>
              <input id="t-end" type="date" min={form.startDate || today()} value={form.endDate} onChange={set('endDate')} required />
            </div>
          </div>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn" disabled={saving}>{saving ? 'Booking…' : 'Book room'}</button>
        </form>
      )}
    </section>
  );
}
