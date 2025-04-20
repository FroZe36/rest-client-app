import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

import { MOCK_DATA_GET } from './mockData';

export const server = setupServer(
  http.get('https://jsonplaceholder.typicode.com/posts', () => {
    return HttpResponse.json(MOCK_DATA_GET);
  }),
  http.get('https://jsonplaceholder.typicode.com/postz', () => {
    return HttpResponse.json({}, { status: 400 });
  }),
  http.post(
    'https://jsonplaceholder.typicode.com/posts',
    async ({ request }) => {
      const requestData = await request.json();
      return HttpResponse.json({
        requestData,
      });
    }
  ),
  http.post('http://localhost:54321/auth/v1/token?grant_type=password', () => {
    return HttpResponse.json({
      access_token: 'mocked_access_token',
      refresh_token: 'mocked_refresh_token',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: 'user_id',
        email: 'test@example.com',
        user_metadata: {},
        aud: 'authenticated',
      },
    });
  }),
  http.post('http://localhost:54321/auth/v1/signup', () => {
    return HttpResponse.json({
      email: 'test@example.com',
      user_metadata: {},
      id: 'user_id',
    });
  })
);
