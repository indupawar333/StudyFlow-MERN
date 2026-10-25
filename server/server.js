const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Assignment = require("./models/Assignment");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Check whether the backend is running
app.get("/", (req, res) => {
  res.send("StudyFlow API is running!");
});

// Check the backend status
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "StudyFlow backend is working!"
  });
});

// Get all assignments
app.get("/api/assignments", async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({
      deadline: 1
    });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assignments"
    });
  }
});

// Add a new assignment
app.post("/api/assignments", async (req, res) => {
  try {
    const assignment = await Assignment.create(req.body);

    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// Update an assignment
app.put("/api/assignments/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found"
      });
    }

    res.json(assignment);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// Delete an assignment
app.delete("/api/assignments/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(
      req.params.id
    );

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found"
      });
    }

    res.json({
      message: "Assignment deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// Connect to MongoDB and start the server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Atlas connected successfully!");

    app.listen(PORT, () => {
      console.log(`StudyFlow server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

startServer();