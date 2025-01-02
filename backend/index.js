const { SirenAlert, Admin } = require('./db/db');
const express = require('express');const bcrypt = require('bcrypt')
const cors = require('cors');
const mainRouter = require('./routes/mainRoute');
const app = express();
app.use(express.json());
app.use(cors());
const policeEmail = 'publicpolice05@gmail.com';
const womeEmail = 'womenorganization62@gmail.com';

// backendurl (deployment): https://campus-schield-backend-api.vercel.app/
app.get('/', (req, res) => {
    res.send("Hello from backend");
});

app.use("/api/v1/", mainRouter);

async function startServer() {
    try {
        // await SirenAlert.deleteMany();

            // const saltRounds = 4;
            // const hashed_password = await bcrypt.hash("police@campus", saltRounds);

            // await Admin.create({
            //     Username: "Police",
            //     Password: hashed_password,
            //     Email: policeEmail,
            // });

            // const hashed_password2 = await bcrypt.hash("women@campus", saltRounds);

            // await Admin.create({
            //     Username: "WomenOrg",
            //     Password: hashed_password2,
            //     Email: womeEmail,
            // });


        app.listen(5000, () => {
            console.log("Listening on port 5000....");
        });
    } catch (error) {
        console.error("Error deleting records:", error);
    }
}

startServer();
