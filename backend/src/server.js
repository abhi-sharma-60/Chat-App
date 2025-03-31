import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './db/index.js'

dotenv.config({
    path:'./.env'
})

const PORT = process.env.PORT

const app = express()
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))


connectDB().then(()=>{
    console.log("Database connected!")
})



app.listen(PORT,()=>{console.log(`server running at ${PORT}...`)})