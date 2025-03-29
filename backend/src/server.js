import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config({
    path:'./.env'
})

const PORT = process.env.PORT

const app = express()
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))




app.listen(PORT,()=>{console.log(`server running at ${PORT}...`)})