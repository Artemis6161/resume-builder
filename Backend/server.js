const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });
console.log("📁 Current directory:", __dirname);
console.log("📄 Looking for .env at:", path.resolve(__dirname, '.env'));


const app = express();

// Middleware
app.use(cors());            // Optional but recommended for frontend-backend communication
app.use(express.json());    // Needed to parse JSON in req.body

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const aiRoutes = require("./routes/aiRoutes");
app.use("/api/ai", aiRoutes);

const resumeRoutes = require("./routes/resumeRoutes");
app.use("/api/resumes", resumeRoutes);
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

console.log("🧪 MONGO_URI from ENV:", process.env.MONGO_URI);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
