 📝 To-Do Application

A full-stack Todo application built as part of the Frontend Developer Long Term Intern Challenge Case 2.

Frontend
- React 19
- Tailwind CSS
- shadcn/ui
- Axios

Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL

Others
- Docker 
- TypeScript
- JWT-based Authentication
- Swagger for API Documentation

---

 Features

- CRUD operations (Create, Read, Update, Delete)
- Subtasks for each todo item
- Status control (Pending / In Progress / Completed)
- Priority levels (Low, Medium, High)
- Due dates for todos
- Search functionality
- JWT Authentication (Login/Register)
- API Documentation with Swagger
-  Dockerized full-stack app

---

Screenshots

Here are some key views from the application:
 ➤ Login Page
./screenshots/LoginPage.png

 ➤ Todo List View
./screenshots/TodoList.png

 ➤ Todo Details & Subtasks
./screenshots/Subtasks.png

 ➤ Add To Do
./screenshots/AddToDo1.png

 ➤ Add To Do For Smaller Devices
./screenshots/AddToDo2.png


---

Deployment

This project is fully dockerized and can be run with a single command.  
The setup includes frontend, backend (Node.js + Express), and a PostgreSQL instance.

```bash
docker compose up --build


