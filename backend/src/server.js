import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './db/index.js'
import router from './routes/index.js'
import cookieParser from "cookie-parser"
import {app, server} from './socket/index.js'


import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config({
    path:'./.env'
})


// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PORT = process.env.PORT

//const app = express()
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(cookieParser());

//api
app.use('/api',router)



// ✅ Serve frontend static files
const buildPath = path.join(__dirname, '../frontend/dist'); // Adjust if your build path is different
app.use(express.static(buildPath));

// ✅ Handle SPA routing fallback (e.g., /email)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});




connectDB().then(()=>{
    console.log("Database connected!")
    server.listen(PORT,()=>{console.log(`server running at ${PORT}...`)})
})



