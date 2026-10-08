import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const OwnerContext = createContext(null);

export function OwnerProvider({ children }) {
  const [owners, setOwners] = useState([]);
  const [ownerId, setOwnerId] = useState(() => {
    try {
      return Number(localStorage.getItem('ownerId')) || null;
    } catch {
      return null;
    }
  });

  const refresh = useCallback(async () => {
    try {
      setOwners(await api.listOwners());
    } catch {
      setOwners([]);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const selectOwner = (id) => {
    setOwnerId(id);
    try {
      if (id) localStorage.setItem('ownerId', String(id));
      else localStorage.removeItem('ownerId');
    } catch {
      /* storage unavailable */
    }
  };

  const registerOwner = async (data) => {
    const created = await api.createOwner(data);
    await refresh();
    selectOwner(created.id);
    return created;
  };

  const owner = owners.find((o) => o.id === ownerId) ?? null;

  return (
    <OwnerContext.Provider value={{ owners, owner, selectOwner, registerOwner }}>
      {children}
    </OwnerContext.Provider>
  );
}

export const useOwner = () => useContext(OwnerContext);
