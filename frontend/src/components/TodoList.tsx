import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function TodoTable() {
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const navigate = useNavigate();

  const [newToDo, setNewToDo] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
    situation:"Pending"
  });

  const [editTodo, setEditTodo] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
    situation:""
  });

  const [todos, setTodos] = useState<any[]>([]);



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
        situation:""
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



  //Get to do function
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch("http://localhost:3001/todos");
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
  };
  

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8">
      <div className="text-center my-4">
        <h1 className="text-sky-800 text-xl font-bold">To Do List</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="w-[88%] mx-auto table-fixed border rounded-lg">
          <thead className="bg-gray-100 text-sm text-gray-600">
            <tr className="text-xs sm:text-sm">
              <th className="bg-gray-300 p-5">Title</th>
              <th className="bg-gray-300 p-5">Description</th>
              <th className="bg-gray-300 p-5">Priority</th>
              <th className="bg-gray-300 p-5">Situation</th>
              <th className="bg-gray-300 p-5">Deadline</th>
              <th className="bg-gray-300 p-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
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
                          className="bg-gray-400 hover:bg-gray-600 text-white rounded shadow px-3 py-1"
                          onClick={() => handleSaveEdit(todo.id)}
                        >
                          Save
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 px-3 py-1"
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
                    <td className="p-3 sm:p-5 text-xs sm:text-sm text-center">{todo.situation}</td>
                    <td className="p-3 sm:p-5 text-xs sm:text-sm text-center">
                      {todo.deadline &&
                        new Date(todo.deadline).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                    </td>
                    <td className="p-3 flex flex-wrap items-center justify-center gap-2">
                      <button
                        className="px-3 py-1 bg-gray-400 hover:bg-gray-600 text-white rounded shadow transition text-sm"
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
                        className="px-3 py-1 text-red-500 hover:text-red-700 rounded shadow transition text-sm"
                      >
                        Delete
                      </button>
                      <div className="absolute top-0 right-0 h-full left-full ml-1 w-[6px] bg-gray-400 hover:w-20 transition-all duration-300 overflow-hidden z-10 group">
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
  
            {isAdding && (
              <tr className="border-t bg-gray-50">
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
                <td className="p-3 flex justify-center items-center gap-2">
                  <button
                    onClick={handleAdd}
                    className="bg-gray-400 hover:bg-gray-600 text-white rounded shadow px-3 py-1 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="text-red-500 hover:text-red-700 px-3 py-1 text-sm"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
      <div className="flex justify-end mt-4">
        <button
          onClick={() => {
            setIsAdding(true);
            setEditId(null);
          }}
          className="bg-gray-400 hover:bg-gray-600 text-white rounded shadow px-4 py-2 text-sm"
        >
          ➕ Add todo
        </button>
      </div>
    </div>
  );
  
}
