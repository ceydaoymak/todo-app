import { useState,useEffect } from "react";

export default function TodoTable() {
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [newToDo, setNewToDo] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: ""
  });

  const [editTodo, setEditTodo] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: ""
  });

  const [todos, setTodos] = useState<any[]>([]);

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
        deadline: ""
      });
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      alert("Görev güncellenemedi.");
    }
  };
  

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">To Do List</h1>
      </div>
      <table className="w-full max-w-[90vw] table-fixed border rounded-lg">
        <thead className="bg-gray-100 text-sm text-gray-600">
          <tr>
            <th className="bg-gray-300 p-5">Title</th>
            <th className="bg-gray-300 p-5">Description</th>
            <th className="bg-gray-300 p-5">Priority</th>
            <th className="bg-gray-300 p-5">Deadline</th>
            <th className="bg-gray-300 p-5">Ekle/Çıkar</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo, index) => (
            <tr key={index} className="border-t">
              {editId === index ? (
                <>
                  <td className="p-3">
                    <input
                      value={editTodo.title}
                      onChange={(e) =>
                        setEditTodo({ ...editTodo, title: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      value={editTodo.description}
                      onChange={(e) =>
                        setEditTodo({
                          ...editTodo,
                          description: e.target.value
                        })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="p-3">
                    <select
                      value={editTodo.priority}
                      onChange={(e) =>
                        setEditTodo({
                          ...editTodo,
                          priority: e.target.value
                        })
                      }
                      className="w-full border px-2 py-1 rounded"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <input
                      type="date"
                      value={editTodo.deadline}
                      onChange={(e) =>
                        setEditTodo({
                          ...editTodo,
                          deadline: e.target.value
                        })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="p-3 flex flex-wrap items-center justify-center gap-2">
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
                  </td>
                </>
              ) : (
                <>
                  <td className="p-3">{todo.title}</td>
                  <td className="p-3">{todo.description}</td>
                  <td className="p-3">{todo.priority}</td>
                  <td className="p-3">{todo.deadline}</td>
                  <td className="p-3 flex flex-wrap items-center justify-center gap-2">
                    <button
                      className="bg-gray-400 hover:bg-gray-600 text-white rounded shadow px-3 py-1"
                      onClick={() => {
                        setEditId(todo.id);
                        setEditTodo(todo);
                      }}
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="text-red-500 hover:text-red-700 px-3 py-1"
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}

          {isAdding && (
            <tr className="border-t bg-gray-50">
              <td className="p-5">
                <input
                  placeholder="Title"
                  value={newToDo.title}
                  onChange={(e) =>
                    setNewToDo({ ...newToDo, title: e.target.value })
                  }
                />
              </td>
              <td className="p-5">
                <input
                  placeholder="Description"
                  value={newToDo.description}
                  onChange={(e) =>
                    setNewToDo({ ...newToDo, description: e.target.value })
                  }
                />
              </td>
              <td className="p-5">
                <select
                  className="w-full border p-1 rounded"
                  value={newToDo.priority}
                  onChange={(e) =>
                    setNewToDo({ ...newToDo, priority: e.target.value })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </td>
              <td className="p-5">
                <input
                  type="date"
                  className="w-full border p-1 rounded"
                  value={newToDo.deadline}
                  onChange={(e) =>
                    setNewToDo({ ...newToDo, deadline: e.target.value })
                  }
                />
              </td>
              <td className="flex flex-wrap items-center justify-center gap-2 pt-2 pb-2">
                <button
                  className="bg-gray-400 hover:bg-gray-600 text-white rounded shadow px-3 py-1"
                  onClick={async () => {
                    if (!newToDo.title.trim()) {
                      alert("Başlık boş bırakılamaz.");
                      return;
                    }

                    if (!newToDo.description.trim()) {
                      alert("Açıklama boş bırakılamaz.");
                      return;
                    }

                    const now = new Date().toISOString().split("T")[0];
                    if (
                      newToDo.deadline &&
                      newToDo.deadline < now
                    ) {
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
                        deadline: ""
                      });
                      setIsAdding(false);
                    } catch (err) {
                      console.error("HATA:", err);
                      alert("Görev eklenemedi.");
                    }
                  }}
                >
                  Save
                </button>
                <button
                  className="text-red-500 hover:text-red-700 text-lg"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => setIsAdding(true)}
          className="bg-gray-400 hover:bg-gray-600 text-white rounded shadow px-3 py-1"
        >
          ➕ Add todo
        </button>
      </div>
    </div>
  );
}
