require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger");

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
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use routes
const userRoutes = require("./routes/userRoute");
app.use("/api/users", userRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server started on port ${port}`));
