export const CURRENCY = '₹';

export const ROOM_TYPES = [
  { value: 'SINGLE', label: 'Single room' },
  { value: 'DOUBLE', label: 'Double room' },
  { value: 'SHARED', label: 'Shared room' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'ONE_BHK', label: '1 BHK' },
];

export const typeLabel = (value) =>
  ROOM_TYPES.find((t) => t.value === value)?.label ?? value;

export const formatRent = (rent) =>
  `${CURRENCY}${Number(rent).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export const today = () => new Date().toISOString().slice(0, 10);

export const formatDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
