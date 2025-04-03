import axios from "axios";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function TodoTable() {
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchQuery,setSearchQuery]=useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);

  const [newToDo, setNewToDo] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
    situation:"Pending",
    subtasks: [],
  });

  const [editTodo, setEditTodo] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
    situation:""
  });

  const [todos, setTodos] = useState<any[]>([]);
    
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:3001/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(res => {
        setUsername(res.data.username);
      }).catch(err => {
        console.error("Kullanıcı adı alınamadı:", err);
      });
    }
  }, []);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000); // 5 saniye
  
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);
  
  useEffect(() => {
    document.body.classList.remove("dark");
  }, []);
  
  // Add to do function
  const handleAdd = async () => {
    if (!newToDo.title.trim()) {
      alert("Başlık boş bırakılamaz.");
      return;
    }
  
    if (!newToDo.description.trim()) {
      alert("Açıklama boş bırakılamaz.");
      return;
    }
  
    const now = new Date().toISOString().split("T")[0];
    if (newToDo.deadline && newToDo.deadline < now) {
      alert("Bitiş tarihi geçmiş olamaz.");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:3001/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newToDo),
      });
  
      if (!res.ok) {
        throw new Error("Görev eklenemedi");
      }
  
      const saved = await res.json();
      setTodos([...todos, saved]);
      setNewToDo({
        title: "",
        description: "",
        priority: "Medium",
        deadline: "",
        situation:"",
        subtasks:[],
      });
      setIsAdding(false);
    } catch (err) {
      console.error("HATA:", err);
      alert("Görev eklenemedi.");
    }
  };


  
//Delete to do function
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Bu görevi silmek istediğine emin misin?");
    if (!confirmed) return;
  
    try {
      const res = await fetch(`http://localhost:3001/todos/${id}`, {
        method: "DELETE",
      });
  
      if (!res.ok) throw new Error("Silme başarısız.");
  
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Silme işlemi başarısız oldu.");
    }
  };

//Search Function
  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    todo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  //Get to do function
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/todos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Veriler alınamadı.");
        const data = await res.json();
        setTodos(data);
      } catch (err) {
        console.error("Görevleri çekerken hata:", err);
      }
    };
  
    fetchTodos();
  }, []);
  



  //Update function
  const handleSaveEdit = async (id: number) => {
    if (!editTodo.title.trim()) {
      alert("Başlık boş bırakılamaz.");
      return;
    }
  
    if (!editTodo.description.trim()) {
      alert("Açıklama boş bırakılamaz.");
      return;
    }
  
    const now = new Date().toISOString().split("T")[0];
    if (editTodo.deadline && editTodo.deadline < now) {
      alert("Bitiş tarihi geçmiş olamaz.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editTodo),
      });
  
      if (!res.ok) throw new Error("Güncelleme başarısız.");
  
      const updated = await res.json();
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updated : todo))
      );
      setEditId(null);
      setEditTodo({
        title: "",
        description: "",
        priority: "Medium",
        deadline: "",
        situation:""
      });
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      alert("Görev güncellenemedi.");
    }

    useEffect(() => {
      const fetchTodos = async () => {
        const token = localStorage.getItem("token");
    
        try {
          const res = await axios.get("http://localhost:3001/todos", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTodos(res.data);
        } catch (err) {
          console.error("Todo çekme hatası:", err);
        }
      };
    
      fetchTodos();
    }, []);
    
  };

  const handleLogout=() =>{
    localStorage.removeItem("token");
    navigate("/login");
  }
  

  return (

    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8">
    <div className={`text-xl font-bold text-center text-sky-800 mb-4 transition-opacity duration-500 ${ showWelcome ? "opacity-100" : "opacity-0"}`}>Welcome, {username}!</div>


    <div className="w-[88%] lg:w-[70%] mx-auto flex justify-between items-center mb-4">
        <h1 className="text-sky-800 text-xl font-bold">To Do List</h1>

  <input
    type="text"
    placeholder="Search to do.."
    className="w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 border px-3 py-1 rounded text-sm"
    onChange={(e)=> setSearchQuery(e.target.value)}
    value={searchQuery}
  />
</div>

<div className="overflow-x-auto">
     <table className="w-[88%]  mx-auto table-fixed border rounded-lg lg:w-[70%]">
    <thead className="bg-gray-100 text-gray-600">
  <tr>
    <th className="bg-gray-300 px-2 py-2 text-[10px] sm:text-xs md:text-sm whitespace-nowrap min-w-[80px]">Title</th>
    <th className="bg-gray-300 px-2 py-2 text-[10px] sm:text-xs md:text-sm whitespace-nowrap min-w-[100px]">Description</th>
    <th className="bg-gray-300 px-2 py-2 text-[10px] sm:text-xs md:text-sm whitespace-nowrap min-w-[80px]">Priority</th>
    <th className="bg-gray-300 px-2 py-2 text-[10px] sm:text-xs md:text-sm whitespace-nowrap min-w-[90px]">Situation</th>
    <th className="bg-gray-300 px-2 py-2 text-[10px] sm:text-xs md:text-sm whitespace-nowrap min-w-[100px]">Deadline</th>
    <th className="bg-gray-300 px-2 py-2 text-[10px] sm:text-xs md:text-sm whitespace-nowrap min-w-[80px]">Actions</th>
  </tr>
</thead>
          <tbody>
            {filteredTodos.map((todo) => (
              <tr
                key={todo.id}
                className="relative group border-t hover:bg-gray-50 transition"
              >
                {editId === todo.id ? (
                  <>
                    {["title", "description", "priority", "situation", "deadline"].map(
                      (field) => (
                        <td key={field} className="p-3 sm:p-5 text-xs sm:text-sm">
                          <div className="flex items-center justify-center h-full w-full">
                            {field === "priority" || field === "situation" ? (
                              <select
                                value={editTodo[field]}
                                onChange={(e) =>
                                  setEditTodo({
                                    ...editTodo,
                                    [field]: e.target.value,
                                  })
                                }
                                className="w-full border rounded px-3 py-2 text-sm text-center"
                              >
                                {field === "priority" ? (
                                  <>
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                  </>
                                ) : (
                                  <>
                                    <option>Pending</option>
                                    <option>In-Progress</option>
                                    <option>Completed</option>
                                  </>
                                )}
                              </select>
                            ) : field === "deadline" ? (
                              <input
                                type="date"
                                value={editTodo.deadline}
                                onChange={(e) =>
                                  setEditTodo({
                                    ...editTodo,
                                    deadline: e.target.value,
                                  })
                                }
                                className="w-full border rounded px-3 py-2 text-sm text-center"
                              />
                            ) : (
                              <input
                                type="text"
                                value={editTodo[field]}
                                onChange={(e) =>
                                  setEditTodo({
                                    ...editTodo,
                                    [field]: e.target.value,
                                  })
                                }
                                className="w-full border rounded px-3 py-2 text-sm text-center"
                              />
                            )}
                          </div>
                        </td>
                      )
                    )}
  
                    <td className="p-5 sm:p-2 md:p-2">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-400 hover:bg-gray-600 text-white rounded shadow transition text-xs sm:text-sm md:text-base"
                          onClick={() => handleSaveEdit(todo.id)}
                        >
                          Save
                        </button>
                        <button
                          className="px-2 py-1 sm:px-3 sm:py-1 text-red-500 hover:text-red-700 bg-transparent rounded shadow transition text-xs sm:text-sm md:text-base"
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3 sm:p-5 text-xs sm:text-sm text-center">{todo.title}</td>
                    <td className="p-3 sm:p-5 text-xs sm:text-sm text-center">{todo.description}</td>
                    <td className="p-3 sm:p-5 text-xs sm:text-sm text-center">{todo.priority}</td>
                    <td className="p-3 sm:p-5 text-left text-center whitespace-nowrap">
                    <span
                      className={`px-2 py-[2px] rounded-full text-white text-[10px] sm:text-xs md:text-sm ${
                        todo.situation === "Completed"
                          ? "bg-green-500"
                          : todo.situation === "In-Progress"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {todo.situation}
                    </span>
                  </td>

                    <td className="p-3 sm:p-5 text-xs sm:text-sm text-center">
                      {todo.deadline &&
                        new Date(todo.deadline).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                    </td>
                    <td className="p-3 flex flex-wrap items-center justify-center gap-2 ">
                      <button
                        className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-400 hover:bg-gray-600 text-white rounded shadow transition text-xs sm:text-sm md:text-base"
                        onClick={() => {
                          setEditId(todo.id);
                          setEditTodo(todo);
                          setIsAdding(false);
                        }}
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="px-2 py-1 sm:px-3 sm:py-1 text-red-500 hover:text-red-700 bg-transparent rounded shadow transition text-xs sm:text-sm md:text-base"
                      >
                        Delete
                      </button>
                      <div className="absolute top-0 left-0 h-full right-full ml-1 w-[6px] bg-gray-400 hover:w-20 transition-all duration-300 overflow-hidden z-10 group">
                      <button 
                        onClick={() => navigate(`/details/${todo.id}`)}
                        className="w-full h-full text-xs text-white bg-sky-700  hover:bg-sky-800 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        View Details
                      </button>
                    </div>
      
                    </td>
                  </>
                )}
              </tr>
            ))}
            {filteredTodos.length===0 && !isAdding && (
              <tr>
                <td colSpan={6} className="text-center font-bold text-sky-800 py-4">
                  No results found.
                </td>
              </tr>
            )}
  
  {isAdding && (
  <>
    {/* Mobil görünüm */}
    <tr className="sm:hidden">
      <td colSpan={6} className="p-4">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Title"
            value={newToDo.title}
            onChange={(e) => setNewToDo({ ...newToDo, title: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Description"
            value={newToDo.description}
            onChange={(e) =>
              setNewToDo({ ...newToDo, description: e.target.value })
            }
            className="border rounded px-3 py-2 text-sm"
          />
          <select
            value={newToDo.priority}
            onChange={(e) =>
              setNewToDo({ ...newToDo, priority: e.target.value })
            }
            className="border rounded px-3 py-2 text-sm"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select
            value={newToDo.situation}
            onChange={(e) =>
              setNewToDo({ ...newToDo, situation: e.target.value })
            }
            className="border rounded px-3 py-2 text-sm"
          >
            <option>Pending</option>
            <option>In-Progress</option>
            <option>Completed</option>
          </select>
          <input
            type="date"
            value={newToDo.deadline}
            onChange={(e) =>
              setNewToDo({ ...newToDo, deadline: e.target.value })
            }
            className="border rounded px-3 py-2 text-sm"
          />
    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 w-full">
      <button
        onClick={handleAdd}
        className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-400 hover:bg-gray-600 text-white rounded shadow transition text-xs sm:text-sm md:text-base"
      >
        Save
      </button>
      <button
        onClick={() => setIsAdding(false)}
        className="px-2 py-1 sm:px-3 sm:py-1 text-red-500 hover:text-red-700 bg-transparent rounded shadow transition text-xs sm:text-sm md:text-base"
      >
        Cancel
      </button>
    </div>

        </div>
      </td>
    </tr>

    {/* Masaüstü görünüm */}
    <tr className="hidden sm:table-row border-t bg-gray-50">
      {["title", "description", "priority", "situation", "deadline"].map(
        (field) => (
          <td key={field} className="p-3 sm:p-5 text-xs sm:text-sm">
            <div className="flex items-center justify-center h-full w-full">
              {field === "priority" || field === "situation" ? (
                <select
                  value={newToDo[field]}
                  onChange={(e) =>
                    setNewToDo({ ...newToDo, [field]: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 text-sm text-center"
                >
                  {field === "priority" ? (
                    <>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </>
                  ) : (
                    <>
                      <option>Pending</option>
                      <option>In-Progress</option>
                      <option>Completed</option>
                    </>
                  )}
                </select>
              ) : field === "deadline" ? (
                <input
                  type="date"
                  value={newToDo.deadline}
                  onChange={(e) =>
                    setNewToDo({ ...newToDo, deadline: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 text-sm text-center"
                />
              ) : (
                <input
                  type="text"
                  placeholder={field}
                  value={newToDo[field]}
                  onChange={(e) =>
                    setNewToDo({ ...newToDo, [field]: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 text-sm text-center"
                />
              )}
            </div>
          </td>
        )
      )}
      <td className="p-3 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={handleAdd}
          className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-400 hover:bg-gray-600 text-white rounded shadow transition text-xs sm:text-sm md:text-base"
        >
          Save
        </button>
        <button
          onClick={() => setIsAdding(false)}
          className="px-2 py-1 sm:px-3 sm:py-1 text-red-500 hover:text-red-700 bg-transparent rounded shadow transition text-xs sm:text-sm md:text-base"
        >
          Cancel
        </button>
      </td>
    </tr>
  </>
)}

          </tbody>
        </table>
      </div>
      <div className="w-[94%] lg:w-[85%] flex justify-end mt-4">
        <button
          onClick={() => {
            setIsAdding(true);
            setEditId(null);
          }}
          className="bg-sky-800 hover:bg-sky-600 text-white rounded shadow px-4 py-2 text-sm"
        >
          Add todo
        </button>

        <button className="ml-2 bg-gray-200 text-blue"
        onClick={handleLogout}>
          Logout
        </button>
      </div>
      
    </div>
  );
  
}
