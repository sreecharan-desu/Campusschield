const express = require('express');
const cors = require('cors');

const mainRouter = require('./routes/mainRoute');
const app = express();
app.use(express.json());
app.use(cors());

//backendurl (deployment):https://campus-schield-backend-api.vercel.app/
app.get('/',(req,res)=>{
    res.send(
        "Hello from backend"
    )
})


app.use("/api/v1/",mainRouter);



app.listen(5000,(req,res)=>{
    console.log("Listening on port 5000....")
})