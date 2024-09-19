import express from 'express';
// import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './utils/db.js';
import cookieParser from "cookie-parser";
import userRoutes from './routes/user.route.js';

dotenv.config({}); // Load env variables from .env file
const app = express(); // Create express app

const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors(corsOptions))

const PORT = process.env.PORT || 3000; // Set PORT

//api's
app.use('/api/v1/users',userRoutes);

// Routes
app.get('/',(req,res)=>{
    res.send("Welcome to the todo list API");
})

app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({message: 'Something broke!',success:false});
});

//for deployement on vercel you do not need to 
connectDB();

// Start server
// app.listen(PORT,()=>{
//     connectDB();
//     console.log(`server is running on http://localhost:${PORT}`);
// });

export default app;
