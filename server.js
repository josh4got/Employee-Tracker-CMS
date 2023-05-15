const express = require("express");
const mysql = require("mysql2");
const sequelize = require("./connections");
require("dotenv").config();
console.log(process.env);

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// TODO: Create a route to show all employees
app.get("/api/employees", (req, res) => {
  const sql = `SELECT * FROM employees`;
  db.query(sql, (err, results) => {
    if (err) {
      // Handle any errors that occur during the query
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

// TODO: Create a route to show all roles
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

// TODO: Create a route to show all departments
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

// Create route to add new employee
app.post("/api/employees", (req, res) => {
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

  db.query(
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

// Create route to add new role
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
// Create route to update employee role
app.put("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  const { title, department, salary, managerId } = req.body;

  if (!title || !department || !salary) {
    return res
      .status(400)
      .json({ error: "Job title, department, and salary are required fields" });
  }

  const sql =
    "UPDATE employees SET title = ?, department = ?, salary = ?, manager_id = ? WHERE id = ?";
  db.query(sql, [title, department, salary, managerId, id], (err, result) => {
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
  });
});
// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
