import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoList from "./components/TodoList";
import TodoDetails from "./components/TodoDetails"; 
import LoginPage from "./components/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<TodoList />} />
        <Route path="/details/:id" element={<TodoDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
