export type User = {
  id: string;
  name: string;
  role: 'admin' | 'user';
  token: string;
  email: string; // obligatoire
};
