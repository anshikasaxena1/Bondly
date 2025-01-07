import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/FriendRoutes.js';


dotenv.config()


const app=express();
app.use(cors({
    origin: 'http://localhost:5173', // Allow only your frontend's origin
    credentials: true,              // Allow cookies and other credentials
  }));
app.use(express.json());

//setting up mongodb uri
const mongoURI=process.env.MONGO_URI;

//connect to mongodb
mongoose.connect(mongoURI).then(()=>{
    console.log("Connected to mongodb");
}).catch((error)=>{
    console.log('Error connecting to mongodb',error);
});

app.use('/api/users', userRoutes);

//server
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=> console.log(`Server running on  port ${PORT}`));