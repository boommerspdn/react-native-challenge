import { SingleUserResponse, UsersListResponse } from '../types';

const BASE_URL = 'https://reqres.in/api';
const API_KEY = process.env.EXPO_PUBLIC_REQRES_API_KEY ?? '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'x-api-key': API_KEY,
      ...options?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  getUsers: (page = 1) => request<UsersListResponse>(`/users?page=${page}`),
  getUser: (id: number) => request<SingleUserResponse>(`/users/${id}`),
  createUser: (name: string, job: string) =>
    request<{ id: string; name: string; job: string; createdAt: string }>('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, job }),
    }),
};
