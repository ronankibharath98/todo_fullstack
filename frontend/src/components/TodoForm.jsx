import { useState } from "react";


const TodoForm = ({ onAddTodo }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !status || !dueDate) {
      alert("Please fill all the fields");
    };

    const newTodo = { title, description, status, dueDate };
    onAddTodo(newTodo);
    // Clear the form after submission
    setTitle("");
    setDescription("");
    setStatus("");
    setDueDate("");

  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 content-center">
      <input
        className="bg-white text-black border border-gray-300 p-2 mr-2 placeholder-gray-500"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="bg-white text-black border border-gray-300 p-2 mr-2 placeholder-gray-500"
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        className="bg-white text-black border border-gray-300 p-2 mr-2"
        value={status}
        defaultChecked="Pending"
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>
      <input
        className="bg-white text-black border border-gray-300 p-2 mr-2"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button type="submit" className="p-2 bg-blue-500 text-white">Add Task</button>
    </form>
  );
};

export default TodoForm;
