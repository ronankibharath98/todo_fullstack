import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTodoById, updateTodoById, deleteTodoById } from '../services/api'; // API functions
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({
    title: '',
    description: '',
    status: '',
    dueDate: ''
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await getTodoById(id);
        if (response) {
          setTask(response.task);
          setUpdatedTask({
            title: response.task.title,
            description: response.task.description,
            status: response.task.status,
            dueDate: new Date(response.task.dueDate).toISOString().split("T")[0]
          });
        } else {
          setError('Task not found');
        }
      } catch (error) {
        setError('Error fetching task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const response = await updateTodoById(id, updatedTask);
      if (response && response.data.success) {
        setTask(response.data.task);
        setIsEditing(false);
      } else {
        setError('Error updating task');
      }
    } catch (error) {
      setError('Error updating task');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (confirmed) {
      try {
        await deleteTodoById(id);
        navigate('/'); // Redirect to the homepage after deletion
      } catch (error) {
        setError('Error deleting task');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='min-h-screen ml-64 bg-black text-white'>
      <div className="pl-10 p-10">
        <h2 className='text-4xl mb-6'>Task Details</h2>
        {isEditing ? (
          <form className="space-y-4 text-black">
            <div>
              <Label htmlFor="title">Title:</Label>
              <Input
                id="title"
                type="text"
                value={updatedTask.title}
                onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description:</Label>
              <Input
                id="description"
                type="text"
                value={updatedTask.description}
                onChange={(e) => setUpdatedTask({ ...updatedTask, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="status">Status:</Label>
              <Input
                id="status"
                type="text"
                value={updatedTask.status}
                onChange={(e) => setUpdatedTask({ ...updatedTask, status: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date:</Label>
              <Input
                id="dueDate"
                type="date"
                value={updatedTask.dueDate}
                onChange={(e) => setUpdatedTask({ ...updatedTask, dueDate: e.target.value })}
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={handleUpdate} className="bg-blue-600 text-white">Save</Button>
              <Button onClick={() => setIsEditing(false)} className="bg-gray-600 text-white">Cancel</Button>
            </div>
          </form>
        ) : (
          <div>
            <p className='text-2xl mb-2'><strong>Title:</strong> {task.title}</p>
            <p className='text-2xl mb-2'><strong>Description:</strong> {task.description}</p>
            <p className='text-2xl mb-2'><strong>Status:</strong> {task.status}</p>
            <p className='text-2xl mb-4'><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
            <div className="flex gap-4">
              <Button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white">Edit</Button>
              <Button onClick={handleDelete} className="bg-red-600 text-white">Delete</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
