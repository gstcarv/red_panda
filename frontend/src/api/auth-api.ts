import { api } from '@/config/api';

export type LoginRequest = {
  email: string;
};

export type LoginResponse = {
  token: string;
  expiresIn: number;
  email: string;
  userId: number;
};

export async function login(params: LoginRequest) {
  return (await api.post<LoginResponse>('/login', params)).data;
}
