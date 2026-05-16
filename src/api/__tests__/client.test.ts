import { api } from '../client';

const BASE_URL = 'https://reqres.in/api';

const mockFetch = (ok: boolean, body: unknown, status = 200) =>
  jest.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  });

beforeEach(() => {
  jest.resetAllMocks();
});

// ---------------------------------------------------------------------------
// getUsers
// ---------------------------------------------------------------------------

describe('api.getUsers', () => {
  it('calls /users?page=1 by default', async () => {
    globalThis.fetch = mockFetch(true, { page: 1, data: [] });
    await api.getUsers();
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/users?page=1`,
      expect.objectContaining({
        headers: expect.objectContaining({ 'x-api-key': expect.any(String) }),
      }),
    );
  });

  it('calls /users?page=2 when page=2 is passed', async () => {
    globalThis.fetch = mockFetch(true, { page: 2, data: [] });
    await api.getUsers(2);
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/users?page=2`,
      expect.anything(),
    );
  });

  it('returns parsed JSON on success', async () => {
    const payload = { page: 1, per_page: 6, total: 12, total_pages: 2, data: [] };
    globalThis.fetch = mockFetch(true, payload);
    const result = await api.getUsers();
    expect(result).toEqual(payload);
  });

  it('throws with status code when response is not ok', async () => {
    globalThis.fetch = mockFetch(false, {}, 404);
    await expect(api.getUsers()).rejects.toThrow('Request failed: 404');
  });
});

// ---------------------------------------------------------------------------
// getUser
// ---------------------------------------------------------------------------

describe('api.getUser', () => {
  it('calls /users/:id with the given id', async () => {
    globalThis.fetch = mockFetch(true, { data: {} });
    await api.getUser(1);
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/users/1`,
      expect.objectContaining({
        headers: expect.objectContaining({ 'x-api-key': expect.any(String) }),
      }),
    );
  });

  it('returns parsed SingleUserResponse on success', async () => {
    const payload = { data: { id: 1, email: 'a@b.com', first_name: 'A', last_name: 'B', avatar: '' } };
    globalThis.fetch = mockFetch(true, payload);
    const result = await api.getUser(1);
    expect(result).toEqual(payload);
  });

  it('throws with status code when response is not ok', async () => {
    globalThis.fetch = mockFetch(false, {}, 500);
    await expect(api.getUser(99)).rejects.toThrow('Request failed: 500');
  });
});

// ---------------------------------------------------------------------------
// createUser
// ---------------------------------------------------------------------------

describe('api.createUser', () => {
  it('sends POST to /users with name and job in body', async () => {
    globalThis.fetch = mockFetch(true, { id: '123', name: 'Alice', job: 'Dev', createdAt: '' });
    await api.createUser('Alice', 'Dev');
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/users`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Alice', job: 'Dev' }),
      }),
    );
  });

  it('sends x-api-key and Content-Type headers', async () => {
    globalThis.fetch = mockFetch(true, { id: '1', name: 'Alice', job: 'Dev', createdAt: '' });
    await api.createUser('Alice', 'Dev');
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-api-key': expect.any(String),
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('returns the created user object on success', async () => {
    const payload = { id: '123', name: 'Alice', job: 'Dev', createdAt: '2026-01-01T00:00:00Z' };
    globalThis.fetch = mockFetch(true, payload);
    const result = await api.createUser('Alice', 'Dev');
    expect(result).toEqual(payload);
  });

  it('throws with status code when response is not ok', async () => {
    globalThis.fetch = mockFetch(false, {}, 400);
    await expect(api.createUser('Alice', 'Dev')).rejects.toThrow('Request failed: 400');
  });
});
