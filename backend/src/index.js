"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./auth");
const swagger_1 = require("./swagger");
dotenv_1.default.config();
exports.app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(auth_1.router);
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
exports.app.get("/todos", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const todos = yield prisma.todo.findMany({
            where: { userId },
        });
        res.json(todos);
    }
    catch (err) {
        console.error("Todo çekme hatası:", err);
        res.status(500).json({ error: "Veriler alınamadı." });
    }
}));
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
exports.app.post("/todos", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, description, priority, deadline, situation, subtasks } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(401).json({ error: "User not authenticated." });
        return;
    }
    if (!title || !description || !deadline || !priority || !situation) {
        res.status(400).json({ error: "Please fill all fields!" });
        return;
    }
    try {
        const newTodo = yield prisma.todo.create({
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
    }
    catch (err) {
        console.error("Post Error: ", err);
        res.status(500).json({ error: "New to-do couldn't be added." });
        return;
    }
}));
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
exports.app.delete("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        yield prisma.todo.delete({ where: { id } });
        res.status(204).end();
    }
    catch (err) {
        console.error("Silme hatası:", err);
        res.status(500).json({ error: "Silinemedi" });
    }
}));
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
exports.app.get("/details/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = parseInt(req.params.id);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const todo = yield prisma.todo.findUnique({ where: { id, userId, }, });
        res.json(todo);
    }
    catch (err) {
        console.error("Detay getirme hatası:", err);
        res.status(500).json({ error: "Detay alınamadı." });
    }
}));
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
exports.app.put("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { title, description, priority, deadline, situation, subtasks } = req.body;
    if (!title || !description || !priority || !deadline) {
        res.status(400).json({ error: "Tüm alanlar zorunlu." });
        return;
    }
    try {
        const updated = yield prisma.todo.update({
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
    }
    catch (err) {
        console.error("Güncelleme hatası:", err);
        res.status(500).json({ error: "Güncellenemedi" });
    }
}));
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
exports.app.get("/me", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const user = yield prisma.user.findUnique({
            where: { id: userId },
        });
        res.json({ username: user === null || user === void 0 ? void 0 : user.username });
    }
    catch (err) {
        res.status(500).json({ error: "Kullanıcı bilgisi alınamadı." });
    }
}));
(0, swagger_1.setupSwagger)(exports.app);
const PORT = process.env.PORT || 3001;
exports.app.listen(PORT, () => {
    console.log(`🚀 Server is working at http://localhost:${PORT}`);
});
