import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { authenticateToken, router as authRouter } from "./auth"; 

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());


app.use(authRouter); 
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


app.put("/todos/:id", async (req, res) => {
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


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is working at http://localhost:${PORT}`);
});
