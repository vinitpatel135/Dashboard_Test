const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const dealRouter = require("./deals/dealRouter");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/deals", dealRouter);

// DB Connection + Server start
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(5151, () => console.log("🚀 Server running on http://localhost:5000"));
    })
    .catch(err => console.error("❌ DB connection error:", err));
