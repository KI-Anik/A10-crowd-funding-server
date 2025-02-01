const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 4000
const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req,res)=>{
    res.send('crowd fuding server here')
})

app.listen(port, ()=>{
    console.log(`connected port on ${port}`)
})