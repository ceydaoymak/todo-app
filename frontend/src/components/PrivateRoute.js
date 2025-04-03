import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
export default function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");
    return token ? children : _jsx(Navigate, { to: "/login" });
}
