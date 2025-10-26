import { MyToDoInterface } from "../models/toDo";
import { useState, useEffect } from "react";

interface MainCompProps {
  todo: MyToDoInterface;
  onUpdate: (updatedTodo: MyToDoInterface) => void;
  onDelete: (id: string) => void; 
}

export default function MainComponent({todo, onUpdate, onDelete}: MainCompProps) {

  const [title, setTitle] = useState("");
  const [remindMe, setRemindMe] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [repeat, setRepeat] = useState<"None" | "Daily" | "Weekly" | "Monthly">("None");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setRemindMe(todo.remindMe ? new Date(todo.remindMe).toISOString().slice(0, 16) : "");
      setDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 16) : "");
      setRepeat(todo.repeat || "None");
      setNote(todo.note || "");
    }
  }, [todo]);

  if (!todo) {
    return <div>Select a task to view details</div>;
  }

  const handleUpdate =async (data: Partial<MyToDoInterface>) => {
    const updatedTodo = {
      ...todo,
      title,
      remindMe: remindMe ? new Date(remindMe).toISOString() : undefined,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      repeat,
      note,
      ...data,
    } as unknown as MyToDoInterface;
    onUpdate(updatedTodo);

    try{
      await fetch("/api/todos/" , {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: updatedTodo._id,
          title: updatedTodo.title,
          remindMe: updatedTodo.remindMe,
          dueDate: updatedTodo.dueDate,
          repeat: updatedTodo.repeat,
          note: updatedTodo.note,
        }),    
    });
    }catch(error){
      console.error("Failed to update todo:", error);
     }
    };


    const handleDelete = async () => {
      if(!todo._id) return;
      const confirmDelete = confirm("Are you sure you want to delete this task?");
      if(!confirmDelete) return;

      try{
        const response = await fetch(`/api/todos/?id=${todo._id}` , {
          method: "DELETE",});
          if(!response.ok){
            throw new Error("Failed to delete todo");
          }
          onDelete(todo._id.toString());
      }catch(error){
        console.error("Failed to delete todo:", error);
        alert("Failed to delete todo. Please try again.");
      }
    };

    




  





  return(
      <div style={{ padding: "20px", background: "#f4f4f4", borderRadius: "10px" }}>
      <h2>Edit Task</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => {
            setTitle(e.target.value);
            handleUpdate({ title: e.target.value });
          }}
          style={{ width: "100%", padding: "8px", marginBottom: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Remind Me:</label>
        <input
          type="datetime-local"
          value={remindMe}
          onChange={(e) => {
            setRemindMe(e.target.value);
            handleUpdate({
              remindMe: e.target.value ? new Date(e.target.value).toISOString() : undefined,
            });
          }}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Due Date:</label>
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => {
            setDueDate(e.target.value);
            handleUpdate({
              dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
            });
          }}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Repeat:</label>
        <select
          value={repeat}
          onChange={(e) => {
            const value = e.target.value as "None" | "Daily" | "Weekly" | "Monthly";
            setRepeat(value);
            handleUpdate({ repeat: value });
          }}
          style={{ width: "100%", padding: "8px" }}
        >
          <option value="none">None</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Note:</label>
        <textarea
          value={note}
          placeholder="Note"
          onChange={(e) => {
            setNote(e.target.value);
            handleUpdate({ note: e.target.value });
          }}
          style={{ width: "100%", padding: "8px", minHeight: "80px" }}
        />
      </div>

      <div>
        <button
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleDelete}
        >
          Delete Task
        </button>
      </div>
    </div>
  )
};