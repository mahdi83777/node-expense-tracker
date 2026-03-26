// index.js
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// ====== Middleware ======
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(express.json());
app.set("view engine", "ejs"); // EJS templates
app.use(express.static("public"));

// ====== MongoDB Connection ======
mongoose.connect(
  "mongodb+srv://mahdi83777:Mahdi321123@cluster0.luwhldd.mongodb.net/?appName=Cluster0",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("MongoDB connected ✅"))
.catch(err => console.log("MongoDB connection error:", err));

// ====== Mongoose Schema ======
const expenseSchema = new mongoose.Schema({
  item: String,
  category: String,
  amount: Number
});

const Expense = mongoose.model("Expense", expenseSchema);

// ====== Routes ======

// Home page - show all expenses
app.get("/", async (req, res) => {
  const expenses = await Expense.find();
  res.render("index", { expenses });
});

// Add expense (from form)
app.post("/add-expense", async (req, res) => {
  const { item, category, amount } = req.body;
  await new Expense({ item, category, amount }).save();
  res.redirect("/");
});

// Delete expense
app.get("/delete/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// Edit form
app.get("/edit/:id", async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  res.render("edit", { expense });
});

// Update expense
app.post("/edit/:id", async (req, res) => {
  const { item, category, amount } = req.body;
  await Expense.findByIdAndUpdate(req.params.id, { item, category, amount });
  res.redirect("/");
});

// Test route for server running
app.get("/ping", (req, res) => {
  res.send("Expense Tracker API is running 🚀");
});

// ====== Start Server ======
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});