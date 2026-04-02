<<<<<<< HEAD
require('dotenv').config();  // Load .env variable
=======
require('dotenv').config();  // Load .env variables
>>>>>>> 29a7ee963a042238c4946aa5f136c21d1a268e1f

const express = require("express");
const mongoose = require("mongoose");
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected ✅"))
.catch(err => console.log("MongoDB connection error:", err));

// Schema & Model
const expenseSchema = new mongoose.Schema({
  item: String,
  category: String,
  amount: Number
});
const Expense = mongoose.model("Expense", expenseSchema);

// Routes

// Home page
app.get("/", async (req, res) => {
  const expenses = await Expense.find();
  res.render("index", { expenses });
});

// Add Expense
app.post("/add-expense", async (req, res) => {
  const { item, category, amount } = req.body;
  await new Expense({ item, category, amount }).save();
  res.redirect("/");
});

// Delete Expense
app.get("/delete/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// Edit Expense
app.get("/edit/:id", async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  res.render("edit", { expense });
});

app.post("/edit/:id", async (req, res) => {
  const { item, category, amount } = req.body;
  await Expense.findByIdAndUpdate(req.params.id, { item, category, amount });
  res.redirect("/");
});

// Test route
app.get("/ping", (req, res) => {
  res.send("Expense Tracker API is running 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});