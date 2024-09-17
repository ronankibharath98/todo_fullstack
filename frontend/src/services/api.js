import { USER_API } from "@/components/utils/constant";
import axios from "axios";

// to get all the todos by user id
export const getTodos = async () => {
    try {
        const response = await axios.get(`${USER_API}/fetch-todo`, {
            // Ensuring cookies are sent with the request to the server to authenticate the user
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
};

// to add a new todo by user id
export const addTodo = async (todo) => {
    try {
        const response = await axios.post(`${USER_API}/add-todo`, todo, {
            withCredentials: true // Ensure cookies are sent
        });
        return response;
    } catch (error) {
        console.error('Error adding todo:', error);
    }
};

// to get a todo by the todo task id and user cookies
export const getTodoById = async (id) => {
    try {
        const response = await axios.get(`${USER_API}/todos/${id}`, {
            withCredentials: true // Ensure cookies are sent
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching todo by ID', error);
    }
};

// to update a todo by the todo task id and user cookies
export const updateTodoById = async (id, todo) => {
    try {
        const response = await axios.put(`${USER_API}/update-todo/${id}`, todo, {
            withCredentials: true
        });
        return response;
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

export const deleteTodoById = async (id) => {
    try {
        const response = await axios.delete(`${USER_API}/delete-todo/${id}`, {
            withCredentials: true
        });
        return response;
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

export const fetchTodaysTodo = async () => {
    try {
        const response = await axios.get(`${USER_API}/todos/today`, { withCredentials: true });
        return response;
    } catch (error) {
        console.log("Error fetching todos for today", error);
    }
}

export const fetchUpcomingTodo = async () => {
    try{
        const reponse = await axios.get(`${USER_API}/todos/upcoming`, {withCredentials: true});
        return reponse;
    }catch(error){
        console.log("Error fetching upcoming todos", error);
    }
}

export const fetchCompletedTodo = async () => {
    try{
        const response = await axios.get(`${USER_API}/todos/completed`, {withCredentials: true});
        return response;
    }catch(error){
        console.log("Error fetching completed todos", error);
    }
}

export const fetchPendingTodo = async () => {
    try{
        const response = await axios.get(`${USER_API}/todos/pending`, {withCredentials: true});
        return response;
    }catch(error){
        console.log("Error fetching completed todos", error);
    }
}