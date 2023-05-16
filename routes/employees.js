const express = require("express");
const sequelize = require("sequelize");
const router = express.Router();

// route to show all employees
router.get("/", (req, res) => {
  const sql = `SELECT * FROM employees`;
  sequelize.query(sql, (err, results) => {
    if (err) {
      // Handle any errors that occur during the query
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

// route to add new employee
router.post("/", (req, res) => {
  const { firstName, lastName, title, department, salary, managerId } =
    req.body;
  if (!firstName || !lastName || !title || !department || !salary) {
    return res.status(400).json({
      error:
        "First name, last name, title, department, and salary are required fields",
    });
  }

  const sql =
    "INSERT INTO employees (first_name, last_name, title, department, salary, manager_id) VALUES (?, ?, ?, ?, ?, ?)";

  sequelize.query(
    sql,
    [firstName, lastName, title, department, salary, managerId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const newEmployee = {
        id: result.insertId,
        firstName,
        lastName,
        title,
        department,
        salary,
        managerId,
      };
      res.status(201).json(newEmployee);
    }
  );
});

// route to update employee role
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, department, salary, managerId } = req.body;

  if (!title || !department || !salary) {
    return res
      .status(400)
      .json({ error: "Job title, department, and salary are required fields" });
  }

  const sql =
    "UPDATE employees SET title = ?, department = ?, salary = ?, manager_id = ? WHERE id = ?";
  sequelize.query(
    sql,
    [title, department, salary, managerId, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const updatedEmployee = {
        id: parseInt(id),
        title,
        department,
        salary,
        managerId,
      };
      res.status(200).json(updatedEmployee);
    }
  );
});

module.exports = router;
