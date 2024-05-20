require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Use routes
const userRoutes = require("./routes/userRoute");
const categoryRoutes = require("./routes/categoryRoute");
const mentorRoute = require("./routes/mentorRoute");
const bookingRoute = require("./routes/bookingRoute");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const app = express();

// Bodyparser Middleware
app.use(bodyParser.json());
app.use(cors());
// Import routes

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/users", userRoutes);
app.use("/api/mentors", mentorRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/category", categoryRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server started on port ${port}`));
