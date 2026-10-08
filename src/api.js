const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let message = 'Something went wrong. Please try again.';
    try {
      const body = await res.json();
      if (body.message) message = body.message;
    } catch {
      /* response had no JSON body */
    }
    throw new Error(message);
  }
  return res.status === 204 ? null : res.json();
}

function qs(params) {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) p.set(key, value);
  });
  const s = p.toString();
  return s ? `?${s}` : '';
}

export const api = {
  listRooms: (params = {}) => request('/rooms' + qs(params)),
  getRoom: (id) => request(`/rooms/${id}`),
  createRoom: (data) => request('/rooms', { method: 'POST', body: JSON.stringify(data) }),
  updateRoom: (id, data) => request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRoom: (id) => request(`/rooms/${id}`, { method: 'DELETE' }),
  setAvailability: (id, available) =>
    request(`/rooms/${id}/availability?available=${available}`, { method: 'PATCH' }),

  listOwners: () => request('/owners'),
  createOwner: (data) => request('/owners', { method: 'POST', body: JSON.stringify(data) }),

  createBooking: (data) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  ownerBookings: (ownerId) => request(`/bookings?ownerId=${ownerId}`),
  cancelBooking: (id) => request(`/bookings/${id}/cancel`, { method: 'PATCH' }),
};
