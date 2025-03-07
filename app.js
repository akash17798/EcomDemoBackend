const path = require('path')

const express = require('express')
const authRoutes = require('./routes/auth')

const app = express()

app.use(express.json())
app.use('/api',authRoutes)

app.get("/",(req, res)=>{
    res.send('Hello World')
})

app.listen(3000,() => {
    console.log("Server is listening on port 3000");
})