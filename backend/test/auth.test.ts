import request from 'supertest';
import { app } from '../src/index'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let token: string;

describe('Auth API', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany(); 
    await prisma.todo.deleteMany();  
  
    
    const userResponse = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'password123' });

    token = userResponse.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        username: 'testuser2',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should return error if username already exists', async () => {
    await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123',
      });

    const response = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('User already exists.');
  });

  it('should login an existing user', async () => {
    await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123',
      });

    const response = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should return error for incorrect credentials', async () => {
    await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123',
      });

    const response = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid username or password.');
  });

  it('should return error if no token is provided for protected route', async () => {
    const response = await request(app)
      .get('/me'); 

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Access denied. No token provided.');
  });

});
