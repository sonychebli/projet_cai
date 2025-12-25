'use client';
import { createContext, useContext } from 'react';

const UserContext = createContext({
  user: { name: 'Utilisateur Test', role: 'user' }
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const user = { name: 'Utilisateur Test', role: 'admin' }; // mock

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};
