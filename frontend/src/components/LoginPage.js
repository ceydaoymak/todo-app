import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
    const [Username, setUsername] = useState("");
    const [Password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { username: Username, password: Password };
        if (isRegistering) {
            await axios.post("http://localhost:3001/register", data);
            setIsRegistering(false);
            setUsername("");
            setPassword("");
            setError("Registration successful! Please log in.");
            return;
        }
        try {
            let response;
            if (isRegistering) {
                response = await axios.post("http://localhost:3001/register", data);
            }
            else {
                response = await axios.post("http://localhost:3001/login", data);
            }
            localStorage.setItem("token", response.data.token);
            navigate("/table");
        }
        catch (err) {
            setError("Invalid username or password.");
        }
    };
    return (_jsxs("div", { className: "flex min-h-screen bg-white", children: [_jsx("div", { className: "w-full md:w-3/5 flex items-center justify-center px-6 md:px-12 lg:px-20 bg-gray-200", children: _jsxs("div", { className: "bg-white p-8 sm:p-10 md:p-12 lg:p-16 rounded-xl shadow-xl w-full max-w-md", children: [_jsx("h1", { className: "text-sky-800 text-3xl font-semibold text-center mb-4", children: "Welcome" }), _jsx("h2", { className: "font-light text-gray-600 text-center mb-6", children: isRegistering
                                ? "Please create a new account to get started."
                                : "Please enter your credentials to log in." }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-5", children: [_jsx("label", { className: "block text-gray-700 text-sm font-semibold mb-2", children: "Username" }), _jsx("input", { type: "text", value: Username, onChange: (e) => setUsername(e.target.value), className: "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500", required: true })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-gray-700 text-sm font-semibold mb-2", children: "Password" }), _jsx("input", { type: "password", value: Password, onChange: (e) => setPassword(e.target.value), className: "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500", required: true })] }), error && (_jsx("div", { className: "text-black font-semibold text-sm mb-4", children: error })), _jsx("button", { type: "submit", className: "w-full bg-sky-800 hover:bg-sky-600 text-white rounded shadow px-4 py-2 text-sm sm:text-base", children: isRegistering ? "Register" : "Login" })] }), _jsx("div", { className: "text-center mt-5", children: _jsxs("p", { className: "text-sm text-gray-600", children: [isRegistering ? "Already have an account?" : "Don't have an account?", " ", _jsx("a", { onClick: () => setIsRegistering(!isRegistering), className: "text-blue-600 hover:underline cursor-pointer", children: isRegistering ? "Login" : "Register" })] }) })] }) }), _jsx("div", { className: "hidden md:flex w-1/2 bg-white px-10 ml-20 ", children: _jsx("div", { className: "flex flex-col justify-center items-center w-full h-full", children: _jsxs("div", { className: "text-center", children: [_jsxs("h1", { className: "text-sky-800 text-7xl lg:text-8xl font-extrabold leading-[1.1]", children: ["TO DO", _jsx("br", {}), "APP"] }), _jsx("p", { className: "mt-6 text-lg text-sky-800 max-w-xs mx-auto", children: "Plan your day, get things done." })] }) }) })] }));
};
export default LoginPage;
