"use client";

import {useEffect, useState} from "react";
import type { MyToDoInterface } from "../models/toDo";
import MainComponent from "../components/maincomponent";
import { set } from "mongoose";

export default function ToDoApp({children}: {children: string}) {

  const [todos, setTodos] = useState<MyToDoInterface[]>([]);
  const [title, setTitle] = useState<string>("");
  const [selectedTodo, setSelectedTodo] = useState<MyToDoInterface | null>(null);


  const fetchToDos = async () =>{
    const response = await fetch("/api/todos");
    const data = await response.json();
    setTodos(data);
  }

  const addToDo = async () => {
    if(title.trim() === ""){
      return;
    }
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({title}),    
  });

  const newToDo = await response.json();
  setTodos((prev) => [...prev, newToDo]);
  setTitle("");

  };

  useEffect(() => {
    fetchToDos();
  }, []);

  const toggleCompleted = async (id: string, completed: boolean) => {
    const response = await fetch("/api/todos/" , {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({id, completed: !completed}),    
  });
    const updatedToDo = await response.json();
    setTodos((prev) => prev.map((todo) => todo._id === id ? updatedToDo : todo));
  };

  const handleImportant = async (id: string, important: boolean) => {
    const response = await fetch("/api/todos/" , {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({id, important: !important}),
  });
    const updatedToDo = await response.json();
    setTodos((prev) => prev.map((todo) => todo._id === id ? updatedToDo : todo));
  };

  const filteredTodos = todos.filter((todo) => {
    if(children === "My Day"){
      return !todo.completed;
    } else if(children === "Important"){
      return todo.important;
    } else if(children === "Planned"){
      const today = new Date();
      return todo.dueDate && new Date(todo.dueDate) >= today;
    } else {
      return true;
    }
  });

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        gap: "20px",
        padding: "20px",
        minHeight: "100vh",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          flex: selectedTodo ? 1 : "1 1 100%",
          backgroundColor: "grey",
          borderRadius: "10px",
          padding: "20px",
          transition: "flex 0.3s ease",
        }}
      >
        <h1>{children}</h1>

        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Write a task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={addToDo}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>

        <div style={{ marginTop: "20px" }}>
          {filteredTodos.map((todo) => (
            <div
              key={todo._id as string}
              onClick={() => setSelectedTodo(todo)} 
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "white",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "8px",
                cursor: "pointer",
              }}
            >
              <button
                style={{ backgroundColor: "lightblue", border: "none", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCompleted(todo._id as string, todo.completed);
                }}
              >
                {todo.completed ? "✅" : "❌"}
              </button>

              <span style={{ flex: 1, marginLeft: "10px", textAlign: "left" }}>
                {todo.title}
              </span>

              <button
                style={{ backgroundColor: "lightblue", border: "none", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleImportant(todo._id as string, todo.important as boolean);
                }}
              >
                {todo.important ? "⭐" : "☆"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedTodo && (
        <div style={{ flex:"1", transition: "flex 0.3s ease" }}>
          <MainComponent
            todo={selectedTodo}
            onUpdate={async (updatedTodo) => {
              
              setTodos((prev) =>
                prev.map((t) => (t._id === updatedTodo._id ? updatedTodo : t))
              );
              setSelectedTodo(updatedTodo);

             
              try {
                await fetch("/api/todos", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    id: updatedTodo._id,
                    title: updatedTodo.title,
                    remindMe: updatedTodo.remindMe,
                    dueDate: updatedTodo.dueDate,
                    repeat: updatedTodo.repeat,
                    note: updatedTodo.note,
                  }),
                });
              } catch (error) {
                console.error("Error updating todo:", error);
              }
            }}
            onDelete={(id) => {
             setTodos((prev) => prev.filter((t) => t._id !== id));
             setSelectedTodo(null); 
             }}
          />
        </div>
      )}
    </div>
  );
}
