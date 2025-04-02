import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const router = express.Router();
const SECRET = process.env.SECRET_KEY || "default-secret-key";  

// Register route
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
     res.status(400).json({ error: "User already exists." });
     return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);


  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1h" });

   
     res.json({ token });
     return;
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      username: username  
    }
  });
  if (!user) {
   res.status(400).json({ error: "Invalid username or password." });
   return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(400).json({ error: "Invalid username or password." });
    return;
  }

 
  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1h" });

  res.json({ token });
});

const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  jwt.verify(token, SECRET, (err: any, user: any) => {
    if (err) {
      res.status(403).json({ error: "Invalid token." });
      return;
    }

    req.user = { userId: user.userId };
        next();
  });
};

export { router, authenticateToken };
