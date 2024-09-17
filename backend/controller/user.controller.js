import { User } from "../models/user.model.js";
import { Task } from "../models/todos.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new user and hash the password before saving to the database
export const register = async (req, res) => {
    try {
        let { name, email, password, phoneNumber } = req.body;
        email = email.toLowerCase();

        if (!name || !email || !password || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the required fields"
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name,
            email,
            phoneNumber,
            password: hashedPassword
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email }, // Payload (user's ID and email)
            process.env.JWT_SECRET, // Secret key from environment variables
            { expiresIn: '7d' } // Token expiration (7 days)
        );

        // Send token in a cookie and respond with success
        return res.status(200).cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            // httpOnly: true, // Ensures the cookie is not accessible via JavaScript
            // sameSite: "strict" // Cookie will only be sent for same-site requests
        }).json({
            message: `Welcome ${user.name}`,
            success: true,
            user
        });
    } catch (error) {
        console.log("Error during registration: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// Login a user and generate a token for the user to access protected routes
export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the required fields"
            })
        }
        email = email.toLowerCase();
        let user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist with this email"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid Password",
                success: false
            });
        }
        const tokenData = {
            userId: user._id,
        };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "7d" });
        user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profilePhoto: user.profilePhoto
        }

        return res.status(200).cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            // httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
            samesite: "strict"
        }).json({
            message: `Welcome ${user.name}`,
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

// Logout a user by clearing the token cookie
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logout successful",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

// Add a new task to the todo list
export const addTodo = async (req, res) => {
    try {
        const { title, description, status, dueDate } = req.body;
        console.log(req.body);
        if (!title || !description || !status) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the required fields"
            });
        }
        if (status !== "Completed" && status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "Status can only be 'Completed' or 'Pending'"
            });
        }
        const taskExists = await Task.findOne({ title, user: req.user.userId });
        if (taskExists) {
            return res.status(400).json({
                success: false,
                message: "Task already exists"

            });
        }
        const task = await Task.create({
            title,
            description,
            status,
            dueDate,
            user: req.user.userId
        });
        console.log(task);
        return res.status(201).json({
            success: true,
            message: "Task added successfully",
            task
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

// remove a task from the todo list
export const deleteTodoById = async (req, res) => {
    try {
        const { id } = req.params; // Get the task ID from the URL params
        const task = await Task.findOneAndDelete({ _id: id, user: req.user.userId }); // Find the task by ID and ensure it belongs to the authenticated user
        if (!task) {
            return res.status(400).json({
                success: false,
                message: "Task not found or you're not authorized to delete this task"
            })
        }
        // Remove the task from the database
        console.log("Task deleted:", task);
        return res.status(200).json({
            success: true,
            message: "Task removed successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

// Update a task in the todo list
export const updateTodoById = async (req, res) => {
    try {
        const { id } = req.params;  // Get the task ID from the URL params
        const { title, description, status, dueDate } = req.body;
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Please provide the title of the task to update"
            })
        }
        // Find the task by ID and ensure it belongs to the authenticated user
        const task = await Task.findOne({ _id: id, user: req.user.userId });
        console.log(task);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found or you're not authorized to update this task"
            });
        }

        // Update task fields
        if(title) task.title = title;
        if(description) task.description = description;
        if(status) task.status = status;
        if(dueDate) task.dueDate = dueDate;

        // Save the updated task to the database
        await task.save();
        console.log("Task updated:", task);
        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

// Get all tasks in the todo list by user id
export const fetchTodo = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.userId });
        if (!tasks) {
            return res.status(404).json({
                success: false,
                message: "No tasks found"
            });
        }
        // console.log("Tasks:", tasks); //debugging
        return res.status(200).json({
            success: true,
            message: "Tasks retrieved successfully",
            tasks
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

// Get a particular todo-task by the task ID

export const getTodoById = async (req, res) => {
    try {
        console.log("Fetching data for id");
        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Task retrieved successfully",
            task
        });
    }catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching task"
        })
    }
}

export const getTodoByToday = async (req, res) => {
    try{
        const today = new Date();
        const tasks = await Task.find
        ({
            user: req.user.userId,
            dueDate: {
                $gte: today.setHours(0o0,0o0,0o0),
                $lt: today.setHours(23,59,59)
            }
        });
        if (!tasks){
            return res.status(404).json({
                success: false,
                message: "No tasks found for today"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Today's tasks retrieved successfully",
            tasks
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

export const getTodoByUpcoming = async (req, res) => {
    try{
        const today = new Date();
        // Set the start of today (00:00:00)
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const tasks = await Task.find({
            user: req.user.userId,
            dueDate: { $gt: startOfToday }  // Fetch tasks due after today
        });
        if (!tasks){
            return res.status(404).json({
                message: "No tasks upcoming taks found",
                success: false
            })
        }
        return res.status(202).json({
            message: "Today's tasks retrived successfully",
            success: true,
            tasks
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Server Error",
            success: false
        })
    }
}

export const getTodoByCompletedStatus = async (req, res) => {
    try{
        const tasks = await Task.find({
            user: req.user.userId,
            status: "Completed"
        });
        if (!tasks){
            return res.status(404).json({
                message: "No tasks found",
                success: false
            })
        }
        return res.status(202).json({
            message: "Completed tasks retrieved successfully",
            success: true,
            tasks
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Server Error",
            success: false
        })
    }
}

export const getTodoByPendingStatus = async (req, res) => {
    try{
        const tasks = await Task.find({
            user: req.user.userId,
            status: "Pending"
        });
        if (!tasks){
            return res.status(404).json({
                message: "No tasks found",
                success: false
            })
        }
        return res.status(202).json({
            message: "Pending tasks retrieved successfully",
            success: true,
            tasks
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Server Error",
            success: false
        })
    }
}