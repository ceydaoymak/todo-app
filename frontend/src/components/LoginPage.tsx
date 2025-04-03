import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
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
      } else {
        response = await axios.post("http://localhost:3001/login", data);
      }

      localStorage.setItem("token", response.data.token);

      navigate("/table");
    } catch (err) {
      setError("Invalid username or password.");
    }
  };
  return (
  
      <div className="flex min-h-screen bg-white">
      
        <div className="w-full md:w-3/5 flex items-center justify-center px-6 md:px-12 lg:px-20 bg-gray-200">
          <div className="bg-white p-8 sm:p-10 md:p-12 lg:p-16 rounded-xl shadow-xl w-full max-w-md">
            <h1 className="text-sky-800 text-3xl font-semibold text-center mb-4">Welcome</h1>
            <h2 className="font-light text-gray-600 text-center mb-6">
            {isRegistering
              ? "Please create a new account to get started."
              : "Please enter your credentials to log in."}
          </h2>

    
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Username</label>
                <input
                  type="text"
                  value={Username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
    
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                <input
                  type="password"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
    
              {error && (
                <div className="text-black font-semibold text-sm mb-4">{error}</div>
              )}
    
              <button
                type="submit"
                className="w-full bg-sky-800 hover:bg-sky-600 text-white rounded shadow px-4 py-2 text-sm sm:text-base"
              >
                {isRegistering ? "Register" : "Login"}
              </button>
            </form>
    
            <div className="text-center mt-5">
              <p className="text-sm text-gray-600">
                {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
                <a
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  {isRegistering ? "Login" : "Register"}
                </a>
              </p>
            </div>
          </div>
        </div>
    
        <div className="hidden md:flex w-1/2 bg-white px-10 ml-20 ">
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="text-center">
            <h1 className="text-sky-800 text-7xl lg:text-8xl font-extrabold leading-[1.1]">
              TO DO<br />APP
            </h1>
            <p className="mt-6 text-lg text-sky-800 max-w-xs mx-auto">
              Plan your day, get things done.
            </p>
          </div>
        </div>
      </div>
      </div>
    );
    
}  

export default LoginPage;
