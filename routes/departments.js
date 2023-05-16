const express = require("express");
const router = express.Router();

// route to show all departments
app.get("/api/departments", (req, res) => {
  const sql = `SELECT * FROM departments`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

// Create route to add new department
app.post("/api/departments", (req, res) => {
  const { departmentName } = req.body;

  if (!departmentName) {
    return res.status(400).json({ error: "Department name is required" });
  }

  const sql = "INSERT INTO departments (department_name) VALUES (?)";

  db.query(sql, [departmentName], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const newDepartment = {
      id: result.insertId,
      departmentName,
    };
    res.status(201).json(newDepartment);
  });
});

module.exports = router;
