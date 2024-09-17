import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { useState, useEffect } from "react";
import { getTodos, addTodo } from "../services/api";
import { useSelector } from "react-redux";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const { user, isauthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await getTodos();
      setTodos(response?.tasks ?? []);
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async (newTodo) => {
    try {
      const response = await addTodo(newTodo);
      console.log("handleAddTodo response", response);

      // Check if response and response.data exist
      if (response && response.data && response.data.task) {
        setTodos([...todos, response.data.task]);
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleTaskClick = (todo) => {
    setSelectedTodo(todo); // Set the clicked task for further details
    console.log("Task Clicked: ", todo);
  };

  return (
    <div className="p-8 ml-64 bg-black text-white">
      <div className="container mx-auto font-sans">
        <div className="flex flex-col items-center justify-start text-center pt-8">
          <h1 className="text-5xl font-bold mb-4">Welcome to TodoApp</h1>
          <p className="font-semibold leading-relaxed">
            Manage your tasks effortlessly, increase productivity,
            <br />&<br />
            stay organized with TodoApp.
          </p>
        </div>
        <br />
        {isauthenticated || user ? (
          <div>
            <h1 className="text-2xl">Hello, {user.name}</h1>
            <p className="text-lg">You have {todos.length} tasks to complete</p>
            <TodoForm onAddTodo={handleAddTodo} />
            <br />
            <h1 className="text-2xl">Your Task Dashboard</h1>
            <TodoList todos={todos} onTaskClick={handleTaskClick} />
            {/* Showing task details when clicked */}
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
        ) : (
          <div>
            <p className="text-xl mb-6">Please log in to view your tasks or sign up to create an account.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;
