import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoList from "./components/TodoList";
import TodoDetails from "./components/TodoDetails"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodoList />} />
        <Route path="/details/:id" element={<TodoDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
