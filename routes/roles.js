const express = require("express");
const router = express.Router();

// route to show all roles
app.get("/api/roles", (req, res) => {
  const sql = `SELECT * FROM roles`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

// route to add new role
app.post("/api/roles", (req, res) => {
  const { jobTitle, department, salary, employeeId } = req.body;

  if (!jobTitle || !department || !salary) {
    return res
      .status(400)
      .json({ error: "Job title, department, and salary are required fields" });
  }

  const sql =
    "INSERT INTO roles (job_title, department, salary, employee_id) VALUES (?, ?, ?, ?)";

  db.query(sql, [jobTitle, department, salary, employeeId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const newRole = {
      id: result.insertId,
      jobTitle,
      department,
      salary,
      employeeId,
    };
    res.status(201).json(newRole);
  });
});

module.exports = router;
