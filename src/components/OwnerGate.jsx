import { useState } from 'react';
import { useOwner } from '../OwnerContext.jsx';

/** Shows its children once an owner is selected; otherwise lets the user pick or register one. */
export default function OwnerGate({ children }) {
  const { owner, owners, selectOwner, registerOwner } = useOwner();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (owner) return children;

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await registerOwner(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="panel narrow">
      <h1>Who is listing rooms?</h1>
      {owners.length > 0 && (
        <div className="field">
          <label htmlFor="owner-select">Continue as an existing owner</label>
          <select id="owner-select" defaultValue="" onChange={(e) => selectOwner(Number(e.target.value))}>
            <option value="" disabled>Choose an owner</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
            ))}
          </select>
        </div>
      )}

      <form onSubmit={submit}>
        <h2>{owners.length > 0 ? 'Or register a new owner' : 'Register as an owner'}</h2>
        <div className="field">
          <label htmlFor="o-name">Name</label>
          <input id="o-name" value={form.name} onChange={set('name')} required />
        </div>
        <div className="field">
          <label htmlFor="o-email">Email</label>
          <input id="o-email" type="email" value={form.email} onChange={set('email')} required />
        </div>
        <div className="field">
          <label htmlFor="o-phone">Phone</label>
          <input id="o-phone" value={form.phone} onChange={set('phone')} required />
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn" disabled={saving}>{saving ? 'Registering…' : 'Register owner'}</button>
      </form>
    </section>
  );
}
