const { SirenAlert } = require('./db/db');
const express = require('express');
const cors = require('cors');
const mainRouter = require('./routes/mainRoute');
const app = express();
app.use(express.json());
app.use(cors());

// backendurl (deployment): https://campus-schield-backend-api.vercel.app/
app.get('/', (req, res) => {
    res.send("Hello from backend");
});

app.use("/api/v1/", mainRouter);

async function startServer() {
    try {
        // await SirenAlert.deleteMany();
        app.listen(5000, () => {
            console.log("Listening on port 5000....");
        });
    } catch (error) {
        console.error("Error deleting records:", error);
    }
}

startServer();
