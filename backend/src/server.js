import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors({
    origin: 'localhost:5000'
}))




app.listen(()=>{console.log("server running"),3000})