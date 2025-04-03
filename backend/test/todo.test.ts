import request from 'supertest';
import { app } from '../src/index'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let token: string;

describe('Todo API', () => {
  beforeAll(async () => {
  
    await prisma.todo.deleteMany();
    await prisma.user.deleteMany();

  
    const userResponse = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'password123' });

    token = userResponse.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
//create to do
  it('should create a new todo', async () => {
    const response = await request(app)
      .post('/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Todo',
        description: 'This is a test todo.',
        priority: 'Medium',
        deadline: '2025-04-01',
        situation: 'Pending',
        subtasks: [],
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Todo');
  });
//view to do
  it('should get all todos', async () => {
    const response = await request(app)
      .get('/todos')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1); 
  });
// delete todo
  it('should delete a todo', async () => {
    const todoResponse = await request(app)
      .post('/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Todo to Delete',
        description: 'This todo will be deleted.',
        priority: 'Medium',
        deadline: '2025-04-01',
        situation: 'Pending',
        subtasks: [],
      });

    const deleteResponse = await request(app)
      .delete(`/todos/${todoResponse.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteResponse.status).toBe(204);
  });
});
