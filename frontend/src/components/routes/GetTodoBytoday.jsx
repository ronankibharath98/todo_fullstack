import React, { useState, useEffect } from "react";
import { fetchTodaysTodo } from "@/services/api";
import { useNavigate } from "react-router-dom";

const GetTodoByToday = () => {
    const navigate = useNavigate();
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const response = await fetchTodaysTodo();
                if (response.data.success) {
                    setTodos(response.data.tasks);
                } else {
                    setTodos(response.data.message)
                }
            } catch (error) {
                setError("Error fetching todos")
            } finally {
                setLoading(false);
            }
        }
        fetchTodo();
    }, []);

if (loading) return <div>Loading...</div>;
if (error) return <div>{error}</div>;



return (
    <div className="p-8 ml-64">
        <h1 className="text-4xl font-bold mb-4">Today's Tasks</h1>
        <table className="w-full border-collapse border text-white border-gray-200">
            <thead>
                <tr>
                    <th className="border border-gray-300 p-2">Title</th>
                    <th className="border border-gray-300 p-2">Description</th>
                    <th className="border border-gray-300 p-2">Due Date</th>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                </tr>
            </thead>
            <tbody>
            {todos.length > 0 ? (
                        todos.map((todo) => (
                            <tr key={todo._id}>
                                <td className="border border-gray-300 p-2">{todo.title}</td>
                                <td className="border border-gray-300 p-2">{todo.description}</td>
                                <td className="border border-gray-300 p-2">{new Date(todo.dueDate).toLocaleDateString()}</td>
                                <td className="border border-gray-300 p-2">{todo.status}</td>
                                <td className="border border-gray-300 p-2">
                                    <button onClick={() => navigate(`/task/:${todo.user}`)} className="bg-blue-600 text-white p-1">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="border border-gray-300 p-2 text-center">
                                No tasks available today.
                            </td>
                        </tr>
                    )}
            </tbody>
        </table>
    </div>
);
}

export default GetTodoByToday;