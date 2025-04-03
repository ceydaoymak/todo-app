import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import TodoTable from "./components/TodoList";
import TodoDetails from "./components/TodoDetails";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/table" element={
          <PrivateRoute>
            <TodoTable />
          </PrivateRoute>
        } />

        <Route path="/details/:id" element={
          <PrivateRoute>
            <TodoDetails />
          </PrivateRoute>
        } />

        {/* Root'u da yönlendirelim */}
        <Route path="/" element={<Navigate to="/table" />} />
      </Routes>
    </Router>
  );
}
