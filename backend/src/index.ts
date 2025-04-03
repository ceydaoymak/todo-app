import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { authenticateToken, router as authRouter } from "./auth"; 
import { setupSwagger } from "./swagger";


dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());


app.use(authRouter); 


/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos for the authenticated user
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   priority:
 *                     type: string
 *                   deadline:
 *                     type: string
 *                     format: date
 *                   situation:
 *                     type: string
 *                   subtasks:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         text:
 *                           type: string
 *                         done:
 *                           type: boolean
 *                   userId:
 *                     type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
app.get("/todos", authenticateToken, async (req, res) => {
  const userId = (req as any).user?.userId;

  if (!userId) {
     res.status(401).json({ error: "Unauthorized" });
     return;
  }

  try {
    const todos = await prisma.todo.findMany({
      where: { userId },
    });
    res.json(todos);
  } catch (err) {
    console.error("Todo çekme hatası:", err);
    res.status(500).json({ error: "Veriler alınamadı." });
  }
});




/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new todo for the authenticated user
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - priority
 *               - deadline
 *               - situation
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *               deadline:
 *                 type: string
 *                 format: date
 *               situation:
 *                 type: string
 *                 enum: [Pending, Completed, In-Progress]
 *               subtasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                     done:
 *                       type: boolean
 *     responses:
 *       201:
 *         description: Todo created successfully
 */
app.post("/todos", authenticateToken, async (req, res) => {
  const { title, description, priority, deadline, situation, subtasks } = req.body;
  const userId = (req as any).user?.userId;

  if (!userId) {
     res.status(401).json({ error: "User not authenticated." });
     return;
  }

  if (!title || !description || !deadline || !priority || !situation) {
     res.status(400).json({ error: "Please fill all fields!" });
     return;
  }

  try {
    const newTodo = await prisma.todo.create({
      data: {
        title,
        description,
        priority,
        deadline: new Date(deadline),
        situation,
        subtasks,
        userId,
      },
    });

     res.status(201).json(newTodo);
     return;
  } catch (err) {
    console.error("Post Error: ", err);
     res.status(500).json({ error: "New to-do couldn't be added." }); 
     return;
  }

});




/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Todo deleted successfully
 *       500:
 *         description: Error while deleting
 */

app.delete("/todos/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.todo.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error("Silme hatası:", err);
    res.status(500).json({ error: "Silinemedi" });
  }
});



/**
 * @swagger
 * /details/{id}:
 *   get:
 *     summary: Get a single todo by ID for the authenticated user
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the todo to retrieve
 *     responses:
 *       200:
 *         description: Todo found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 priority:
 *                   type: string
 *                 deadline:
 *                   type: string
 *                   format: date
 *                 situation:
 *                   type: string
 *                 subtasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       text:
 *                         type: string
 *                       done:
 *                         type: boolean
 *                 userId:
 *                   type: integer
 *       500:
 *         description: Failed to fetch todo details
 */
app.get("/details/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const userId = (req as any).user?.userId;
  try {
    const todo = await prisma.todo.findUnique({ where: { id, userId, }, });
    res.json(todo);
  } catch (err) {
    console.error("Detay getirme hatası:", err);
    res.status(500).json({ error: "Detay alınamadı." });
  }
});



/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - priority
 *               - deadline
 *               - situation
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date
 *               situation:
 *                 type: string
 *               subtasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                     done:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Todo updated successfully
 */

app.put("/todos/:id",authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, priority, deadline, situation, subtasks } = req.body;

  if (!title || !description || !priority || !deadline) {
    res.status(400).json({ error: "Tüm alanlar zorunlu." });
    return;
  }

  try {
    const updated = await prisma.todo.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        deadline: new Date(deadline),
        situation,
        subtasks,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error("Güncelleme hatası:", err);
    res.status(500).json({ error: "Güncellenemedi" });
  }
});



/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get the current authenticated user's username
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user's data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *       401:
 *         description: Unauthorized - No token provided
 *       500:
 *         description: Failed to fetch user info
 */

app.get("/me", authenticateToken, async (req, res) => {
  const userId = (req as any).user?.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    res.json({ username: user?.username });
  } catch (err) {
    res.status(500).json({ error: "Kullanıcı bilgisi alınamadı." });
  }
});

setupSwagger(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is working at http://localhost:${PORT}`);
});
