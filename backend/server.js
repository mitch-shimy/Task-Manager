require ("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const taskRoutes = require("./routes/taskRoutes")

app.use(cors());
app.use(express.json());
app.use("/api",taskRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
