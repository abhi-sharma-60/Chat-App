import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config({
    path:'./.env'
})

const PORT = process.env.PORT

const app = express()
app.use(cors({
    origin: 'localhost:5000'
}))




app.listen(()=>{console.log(`server running at ${PORT}...`),PORT})