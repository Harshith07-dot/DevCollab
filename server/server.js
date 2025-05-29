import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("MongoDB connected");
    app.listen(PORT,()=>{
        console.log(`Server running on PORT ${PORT}`);
    })
}).catch((err)=>{
    console.log("MongoDB connection error:",err);
})
