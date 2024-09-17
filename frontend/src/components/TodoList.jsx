import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'


const TodoList = ({ todos, onTaskClick }) => {
  const navigate = useNavigate();

  const handleRowClick = (todoId) => {
    navigate(`/task/${todoId}`);
  };
  return (
    <div className='text-white'>
      <Table>
        <TableCaption>List of your Todo's</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-white">Task No</TableHead>
            <TableHead className="w-[100px] text-white">Title</TableHead>
            <TableHead className="text-white">Description</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-right text-whi">Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          { todos && todos.length > 0 ?
          (
          todos.map((todo, index) => (
            <TableRow key={todo._id} onClick={() => handleRowClick(todo._id)}>
              <TableCell>{index+1}</TableCell>
              <TableCell>{todo.title.split(" ")[0]}...</TableCell>
              <TableCell>{todo.description}</TableCell>
              <TableCell>{todo.status}</TableCell>
              <TableCell className="text-right">{new Date(todo.dueDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })}</TableCell>
            </TableRow>
          ))
        ):(
          <TableRow>
            <TableCell colSpan="5" className="text-center">No tasks found</TableCell>
          </TableRow>
        )}
        </TableBody>
      </Table>

    </div>
  );
};

export default TodoList;
