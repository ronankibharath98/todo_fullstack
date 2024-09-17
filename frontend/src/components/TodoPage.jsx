import React, { useState } from "react";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm"; // Assuming you have this form component

const TodoPage = () => {
  const [todos, setTodos] = useState([]); // Manage todos in parent component
  const [selectedTodo, setSelectedTodo] = useState(null);

  // Function to handle adding a new todo
  const handleAddTodo = (newTodo) => {
    setTodos((prevTodos) => [...prevTodos, newTodo]); // Append new todo to the existing list
  };

  const handleTaskClick = (todo) => {
    setSelectedTodo(todo);
    console.log("Task Clicked: ", todo);
  };

  return (
    <div>
      <TodoForm onAddTodo={handleAddTodo} /> {/* Pass addTodo function to form */}
      
      <TodoList todos={todos} onTaskClick={handleTaskClick} /> {/* Pass todos and task click handler to list */}

      {selectedTodo && (
        <div>
          <h2>Task Details</h2>
          <p>Title: {selectedTodo.title}</p>
          <p>Description: {selectedTodo.description}</p>
          <p>Status: {selectedTodo.status}</p>
          <p>Due Date: {new Date(selectedTodo.dueDate).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default TodoPage;
