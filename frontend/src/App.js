import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import TodoTable from "./components/TodoList";
import TodoDetails from "./components/TodoDetails";
import PrivateRoute from "./components/PrivateRoute";
export default function App() {
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/table", element: _jsx(PrivateRoute, { children: _jsx(TodoTable, {}) }) }), _jsx(Route, { path: "/details/:id", element: _jsx(PrivateRoute, { children: _jsx(TodoDetails, {}) }) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/table" }) })] }) }));
}
