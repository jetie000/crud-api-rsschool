import { config } from '../src/helpers/config';
import request from 'supertest';

const defaultUrl = `http://localhost:${config.PORT}/api`;
const userNotFoundId = 'ca56e9bc-324a-488c-a214-0c4efb8db5c6';

describe('User Endpoints', () => {
  test('POST /api/users bad request', async () => {
    const response1 = await request(defaultUrl)
      .post('/users')
      .send({
        username: 0,
        age: 10,
        hobbies: ['test'],
      });
    expect(response1.status).toBe(400);
    expect(response1.body).toEqual('User username is invalid');

    const response2 = await request(defaultUrl).post('/users').send({
      username: 'test',
      age: '10',
    });
    expect(response2.status).toBe(400);
    expect(response2.body).toEqual(
      'User age is invalid, user hobbies is required'
    );
  });

  test('POST /api/users success', async () => {
    const response = await request(defaultUrl)
      .post('/users')
      .send({
        username: 'test',
        age: 10,
        hobbies: ['test'],
      });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      username: 'test',
      age: 10,
      hobbies: ['test'],
    });
  });

  test('GET /api/users', async () => {
    const response = await request(defaultUrl).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(6);
    await request(defaultUrl)
      .post('/users')
      .send({
        username: 'test',
        age: 10,
        hobbies: ['test'],
      });
    const responseSecond = await request(defaultUrl).get('/users');
    expect(responseSecond.status).toBe(200);
    expect(responseSecond.body.length).toBe(7);
  });

  test('GET /api/users/:id not found', async () => {
    const response = await request(defaultUrl).get(`/users/${userNotFoundId}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual('User not found');
  });

  test('GET /api/users/:id bad request', async () => {
    const response = await request(defaultUrl).get(`/users/aaa`);
    expect(response.status).toBe(400);
    expect(response.body).toEqual('User id is invalid');
  });

  test('GET /api/users/:id success', async () => {
    const { body } = await request(defaultUrl)
      .post('/users')
      .send({
        username: 'test',
        age: 10,
        hobbies: ['test'],
      });
    const response = await request(defaultUrl).get(`/users/${body.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: body.id,
      username: 'test',
      age: 10,
      hobbies: ['test'],
    });
  });

  test('PUT /api/users/:id success', async () => {
    const { body } = await request(defaultUrl)
      .post('/users')
      .send({
        username: 'test',
        age: 10,
        hobbies: ['test'],
      });
    const response = await request(defaultUrl)
      .put(`/users/${body.id}`)
      .send({
        username: 'test2',
        age: 11,
        hobbies: ['test2'],
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: body.id,
      username: 'test2',
      age: 11,
      hobbies: ['test2'],
    });
  });

  test('PUT /api/users/:id not found', async () => {
    const response = await request(defaultUrl)
      .put(`/users/${userNotFoundId}`)
      .send({
        username: 'test2',
        age: 11,
        hobbies: ['test2'],
      });
    expect(response.status).toBe(404);
    expect(response.body).toEqual('User not found');
  });

  test('PUT /api/users/:id bad request id', async () => {
    const response = await request(defaultUrl)
      .put(`/users/aaa`)
      .send({
        username: 'test2',
        age: 11,
        hobbies: ['test2'],
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual('User id is invalid');
  });

  test('PUT /api/users/:id bad request body', async () => {
    const { body } = await request(defaultUrl)
      .post('/users')
      .send({
        username: 'test',
        age: 10,
        hobbies: ['test'],
      });
    const response = await request(defaultUrl).put(`/users/${body.id}`).send({
      id: body.id,
      username: 2,
      age: '11',
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      'User username is invalid, user age is invalid, user hobbies is required'
    );
  });

  test('DELETE /api/users/:id success', async () => {
    const { body } = await request(defaultUrl)
      .post('/users')
      .send({
        username: 'test',
        age: 10,
        hobbies: ['test'],
      });
    const response = await request(defaultUrl).delete(`/users/${body.id}`);
    expect(response.status).toBe(204);
  });

  test('DELETE /api/users/:id not found', async () => {
    const response = await request(defaultUrl).delete(
      `/users/${userNotFoundId}`
    );
    expect(response.status).toBe(404);
    expect(response.body).toEqual('User not found');
  });

  test('DELETE /api/users/:id bad request', async () => {
    const response = await request(defaultUrl).delete(`/users/aaa`);
    expect(response.status).toBe(400);
    expect(response.body).toEqual('User id is invalid');
  });
});
