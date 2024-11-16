import { User } from './types';

export const users: User[] = [
  { username: 'servidor1', password: 'servidor123', role: 'servidor' },
  { username: 'pastor1', password: 'pastor123', role: 'pastor' },
];

export const validateUser = (username: string, password: string): User | null => {
  return users.find(user => user.username === username && user.password === password) || null;
};