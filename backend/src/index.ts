import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/todos", async (req, res) => {
  try {
    const todos = await prisma.todo.findMany();
    res.json(todos);
  }catch (err) {
    console.error("HATA:", err); 
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/todos" , async (req,res)=> {
    const {title,description,priority,deadline}=req.body;

    if(!title || !description || !deadline || ! priority){
        res.status(400).json({error:"Please fill all fields!"});
        return;
    }

    try {
        const newTodo=await prisma.todo.create({
            data:{
                title,
                description,
                priority,
                deadline: new Date(deadline),
            },
        });
        res.status(201).json(newTodo);
    }catch(err){
        console.log("Post Error: ", err);
        res.status(500).json({error:"New to do couldn't added."});
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

  app.put("/todos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, description, priority, deadline } = req.body;
  
    if (!title || !description || !priority || !deadline) {
        res.status(400).json({ error: "Tüm alanlar zorunlu." });
        return;
    }
  
    try {
      const updated = await prisma.todo.update({
        where: { id },
        data: { title, description, priority, deadline: new Date(deadline) }
      });
      res.json(updated);
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      res.status(500).json({ error: "Güncellenemedi" });
    }
  });
  
  

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is working on port ${PORT}`);
});
