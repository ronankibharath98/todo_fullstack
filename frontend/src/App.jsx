import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import TaskDetails from './components/TaskDetails';
import GetTodoByToday from './components/routes/GetTodoBytoday';
import GetUpcomingTodos from './components/routes/GetUpcomingTodos';
import GetCompletedTodos from './components/routes/GetCompletedTodos';
import GetPendingTodos from './components/routes/GetPendingTodos';

const App = () => {
  return (
    <Router>
      <div className="flex h-screen">
        <Navbar />
        <div className='flex-1 bg-black overflow-auto'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
        // This is a dynamic route that will match any path that starts with /task/ followed by an ID
            <Route path="/task/:id" element={<TaskDetails />} />
            <Route path="/todos/today" element={<GetTodoByToday />} />
            <Route path="/todos/upcoming" element={<GetUpcomingTodos />} />
            <Route path="/todos/completed" element={<GetCompletedTodos />} />
            <Route path="/todos/pending" element={<GetPendingTodos />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;