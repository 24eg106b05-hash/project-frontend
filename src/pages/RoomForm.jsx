import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import OwnerGate from '../components/OwnerGate.jsx';
import { useOwner } from '../OwnerContext.jsx';
import { CURRENCY, ROOM_TYPES } from '../utils.js';

const BLANK = { roomNumber: '', location: '', rent: '', roomType: 'SINGLE', description: '', available: true };

function Form() {
  const { id } = useParams();
  const editing = Boolean(id);
  const { owner } = useOwner();
  const navigate = useNavigate();
  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api
      .getRoom(id)
      .then((r) =>
        setForm({
          roomNumber: r.roomNumber,
          location: r.location,
          rent: r.rent,
          roomType: r.roomType,
          description: r.description ?? '',
          available: r.available,
        })
      )
      .catch((err) => setError(err.message));
  }, [id, editing]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form, rent: Number(form.rent) };
      if (editing) await api.updateRoom(id, payload);
      else await api.createRoom({ ...payload, ownerId: owner.id });
      navigate('/owner');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="panel narrow">
      <h1>{editing ? 'Edit room' : 'Add a room'}</h1>
      <form onSubmit={submit}>
        <div className="row">
          <div className="field">
            <label htmlFor="r-number">Room number</label>
            <input id="r-number" value={form.roomNumber} onChange={set('roomNumber')} required />
          </div>
          <div className="field">
            <label htmlFor="r-type">Room type</label>
            <select id="r-type" value={form.roomType} onChange={set('roomType')}>
              {ROOM_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="r-location">Location</label>
          <input id="r-location" value={form.location} onChange={set('location')} required />
        </div>
        <div className="field">
          <label htmlFor="r-rent">Monthly rent ({CURRENCY})</label>
          <input id="r-rent" type="number" min="1" value={form.rent} onChange={set('rent')} required />
        </div>
        <div className="field">
          <label htmlFor="r-desc">Description</label>
          <textarea id="r-desc" rows="4" maxLength="500" value={form.description} onChange={set('description')} />
        </div>
        <label className="check">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
          />
          Available for booking
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn" disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Add room'}
        </button>
      </form>
    </section>
  );
}

export default function RoomForm() {
  return (
    <OwnerGate>
      <Form />
    </OwnerGate>
  );
}
