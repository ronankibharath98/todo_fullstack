import express from 'express';
import {
    register,
    login,
    logout,
    addTodo,
    fetchTodo,
    getTodoById,
    deleteTodoById,
    updateTodoById,
    getTodoByToday,
    getTodoByUpcoming,
    getTodoByCompletedStatus,
    getTodoByPendingStatus
} from '../controller/user.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/add-todo").post(isAuthenticated, addTodo);
router.route("/delete-todo/:id").delete(isAuthenticated, deleteTodoById);
router.route("/update-todo/:id").put(isAuthenticated, updateTodoById);

router.route("/fetch-todo").get(isAuthenticated, fetchTodo);
router.route("/todos/today").get(isAuthenticated, getTodoByToday);
router.route("/todos/upcoming").get(isAuthenticated, getTodoByUpcoming);
router.route("/todos/completed").get(isAuthenticated, getTodoByCompletedStatus);
router.route("/todos/pending").get(isAuthenticated, getTodoByPendingStatus);
router.route("/todos/:id").get(isAuthenticated, getTodoById);

  

export default router;