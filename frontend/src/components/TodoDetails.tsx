import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TodoDetails() {
  const { id } = useParams();
  const [todo, setTodo] = useState<any>(null);
  const [newSubtask, setNewSubtask] = useState("");
  const [isAdding,setIsAdding] = useState(false);

  type Subtask = {
    text: string;
    done: boolean;
  };
  // Fetch todo details
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const res = await fetch(`http://localhost:3001/details/${id}`);
        if (!res.ok) throw new Error("Veri alınamadı.");
        const data = await res.json();
        setTodo(data);
      } catch (err) {
        console.error("Detay çekilirken hata:", err);
      }
    };

    fetchTodo();
  }, [id]);

  const toggleSubtask = async (index: number) => {
    const updated = [...todo.subtasks];
    updated[index].done = !updated[index].done;
  
    try {
      const res = await fetch(`http://localhost:3001/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...todo,
          subtasks: updated,
        }),
      });
  
      if (!res.ok) throw new Error("Subtask durumu güncellenemedi");
  
      const updatedTodo = await res.json();
      setTodo(updatedTodo);
    } catch (err) {
      console.error("Toggle hatası:", err);
    }
  };
  

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;

    const updatedSubtasks = [
      ...todo.subtasks,
      { text: newSubtask.trim(), done: false },
    ];

    try {
      const res = await fetch(`http://localhost:3001/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...todo,
          subtasks: updatedSubtasks,
        }),
      });

      if (!res.ok) throw new Error("Subtask eklenemedi");

      const updatedTodo = await res.json();
      setTodo(updatedTodo);
      setNewSubtask("");
    } catch (err) {
      console.error("Subtask ekleme hatası:", err);
    }
  };

  const handleDeleteSubtask = async (index: number) => {
    const updatedSubtasks = [...todo.subtasks];
    updatedSubtasks.splice(index, 1); 
    try {
      const res = await fetch(`http://localhost:3001/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...todo,
          subtasks: updatedSubtasks,
        }),
      });
  
      if (!res.ok) throw new Error("Subtask silinemedi");
  
      const updatedTodo = await res.json();
      setTodo(updatedTodo);
    } catch (err) {
      console.error("Subtask silme hatası:", err);
    }
  };
  

  return (
  <div className="w-screen h-screen flex items-center justify-center px-10 sm:px-13 md:px-20 lg:px-25 xl:px30">
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full ">
      <h1 className="text-xl font-bold mb-1 text-center">{todo?.title}</h1>
      <h2 className="text-lg text-sky-800 mb-2 font-light text-center">Subtasks</h2>
      {todo?.subtasks?.map((subtask: Subtask, index: number) => (
  <div key={index} className="relative group flex items-center justify-between px-4 py-2 bg-white border-b">
    
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        className="w-4 h-4"
        checked={subtask.done}
        onChange={() => toggleSubtask(index)}
      />
      <span className={subtask.done ? "line-through text-gray-500" : ""}>
        {subtask.text}
      </span>
    </div>

    <div className="absolute top-0 right-0 h-full w-[3px] bg-red-400 group-hover:w-20 transition-all duration-300 overflow-hidden z-10">
      <button
        onClick={() => handleDeleteSubtask(index)}
        className="w-full h-full text-xs text-white bg-red-600 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-all duration-300 text-end pr-2"
      >
        Delete
      </button>
    </div>
  </div>
))}


   
{!isAdding ? (
  <>
    <button
      className="bg-sky-800 hover:bg-sky-600 text-white rounded
"
      onClick={() => setIsAdding(true)}
    >
      Add Subtask
    </button>
  </>
):(

    <div className="flex flex-col">
      <input
      className="px-4 py-4"
      type="text"
      value={newSubtask}
      onChange={(e) => setNewSubtask(e.target.value)}
      placeholder="New subtask.."
      />
      <button
      onClick={()=>{
        handleAddSubtask();
        setIsAdding(false);
    }}
      className="bg-sky-800 hover:bg-sky-600 text-white rounded
    px-6 py-2 text-base     
    w-[30%]"
    >Save</button>

      </div>
  
  
  )}
    
</div>
  </div>
    
  );
}
