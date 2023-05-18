// dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");
require("dotenv").config();
console.log(process.env);
// set up connection to database
const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
// main menu function
function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "Select an action:",
        choices: [
          "View All Roles",
          "View All Employees",
          "View All Departments",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      const { action } = answers;

      switch (action) {
        case "View All Roles":
          viewAllRoles();
          break;
        case "View All Employees":
          viewAllEmployees();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update an Employee Role":
          updateEmployeeRole();
          break;
        case "Exit":
          console.log("Goodbye!");
          process.exit(0);
      }
    });
}

// View all roles function
function viewAllRoles() {
  console.log("Viewing all roles");
  db.query("SELECT * FROM roles", function (err, results) {
    console.table(results);
    mainMenu();
  });
}
// view all employees function
function viewAllEmployees() {
  console.log("Viewing all employees");
  db.query("SELECT * FROM employees", function (err, results) {
    console.table(results);
    mainMenu();
  });
}
// view all departments function
function viewAllDepartments() {
  console.log("Viewing all departments");
  db.query("SELECT * FROM departments", function (err, results) {
    console.table(results);
    mainMenu();
  });
}

// add department function
function addDepartment() {
  console.log("Adding a department");
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department you would like to add?",
        validate: (input) => {
          if (input.trim() === "") {
            return "Department name cannot be empty";
          }
          return true;
        },
      },
    ])
    .then((answers) => {
      const departmentName = answers.department;

      db.query(
        "INSERT INTO departments (department_name) VALUES (?)",
        [departmentName],
        (err, result) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`Department "${departmentName}" added successfully`);
          }
          mainMenu();
        }
      );
    })
    .catch((error) => {
      console.error(error);
      mainMenu();
    });
}
// add role function
function addRole() {
  console.log("Adding a role");
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What is the name of the role you would like to add?",
        validate: (input) => {
          if (input.trim() === "") {
            return "Role name cannot be empty";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "department",
        message: "What department does the role belong to?",
        choices: () => {
          return new Promise((resolve, reject) => {
            db.query(
              "SELECT id, department_name FROM departments",
              (err, results) => {
                if (err) {
                  reject(err);
                } else {
                  const departmentChoices = results.map((result) => {
                    return {
                      name: result.department_name,
                      value: result.id,
                    };
                  });
                  resolve(departmentChoices);
                }
              }
            );
          });
        },
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the role you would like to add?",
        validate: (input) => {
          if (isNaN(input)) {
            return "Salary must be a number";
          }
          return true;
        },
      },
    ])
    .then((answers) => {
      const { role, department, salary } = answers;

      db.query(
        "INSERT INTO roles (job_title, department_id, salary) VALUES (?, ?, ?)",
        [role, department, salary],
        (err, result) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`Role "${role}" added successfully`);
          }
          mainMenu();
        }
      );
    })
    .catch((error) => {
      console.error(error);
      mainMenu();
    });
}

function addEmployee() {
  console.log("Adding an Employee");

  inquirer
    .prompt([
      // Prompt for first name
      {
        type: "input",
        name: "firstName",
        message:
          "What is the first name of the employee you would like to add?",
        validate: (input) => {
          if (input.trim() === "") {
            return "First name cannot be empty";
          }
          return true;
        },
      },
      // Prompt for last name
      {
        type: "input",
        name: "lastName",
        message: "What is the last name of the employee you would like to add?",
        validate: (input) => {
          if (input.trim() === "") {
            return "Last name cannot be empty";
          }
          return true;
        },
      },
      // Prompt for department
      {
        type: "list",
        name: "department",
        message:
          "What is the department of the employee you would like to add?",
        choices: () => {
          return new Promise((resolve, reject) => {
            db.query(
              "SELECT department_name FROM departments",
              (err, results) => {
                if (err) {
                  reject(err);
                } else {
                  const departmentNames = results.map(
                    (result) => result.department_name
                  );
                  resolve(departmentNames);
                }
              }
            );
          });
        },
      },
      // Prompt for job title based on selected department
      {
        type: "list",
        name: "jobTitle",
        message: "What is the title of the employee you would like to add?",
        choices: (answers) => {
          const selectedDepartment = answers.department;
          return new Promise((resolve, reject) => {
            db.query(
              "SELECT job_title FROM roles JOIN departments ON roles.department_id = departments.id WHERE departments.department_name = ?",
              [selectedDepartment],
              (err, results) => {
                if (err) {
                  reject(err);
                } else {
                  const roleTitles = results.map((result) => result.job_title);
                  resolve(roleTitles);
                }
              }
            );
          });
        },
      },
      // Prompt for remaining employee details (manager, etc.)
      {
        type: "list",
        name: "manager",
        message: "Select a manager from the same department (optional):",
        choices: (answers) => {
          const selectedDepartment = answers.department;
          return new Promise((resolve, reject) => {
            db.query(
              "SELECT id, first_name, last_name FROM employees WHERE department = ?",
              [selectedDepartment],
              (err, results) => {
                if (err) {
                  reject(err);
                } else {
                  const managers = results.map((result) => ({
                    name: `${result.first_name} ${result.last_name}`,
                    value: result.id,
                  }));
                  // Include an option for null manager
                  managers.push({ name: "None", value: null });
                  resolve(managers);
                }
              }
            );
          });
        },
      },
    ])
    .then((answers) => {
      const { firstName, lastName, jobTitle, department, manager } = answers;

      console.log("Selected job title:", jobTitle);

      db.query(
        "SELECT salary FROM roles WHERE job_title = ?",
        [jobTitle],
        (err, results) => {
          if (err) {
            console.error(err);
            mainMenu();
            return;
          }

          if (results.length === 0) {
            console.error("Job title not found in the roles table");
            mainMenu();
            return;
          }

          const salary = results[0].salary; // Retrieve the salary from the results

          db.query(
            "INSERT INTO employees (first_name, last_name, title, department, salary, manager_id) VALUES (?, ?, ?, ?, ?, ?)",
            [firstName, lastName, jobTitle, department, salary, manager],
            (err, result) => {
              if (err) {
                console.error(err);
              } else {
                console.log(
                  `Employee "${firstName}" "${lastName}" added successfully`
                );
              }
              mainMenu();
            }
          );
        }
      );
    })
    .catch((error) => {
      console.error(error);
      mainMenu();
    });
}

// functions to update tables
function updateEmployeeRole() {
  console.log("Updating an employee's role");

  // Retrieve the list of employees
  db.query(
    "SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name FROM employees",
    (err, results) => {
      if (err) {
        console.error(err);
        mainMenu();
        return;
      }

      const employeeChoices = results.map((result) => ({
        name: result.employee_name,
        value: result.id,
      }));

      // Prompt user to select the employee to update
      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Select the employee you want to update:",
            choices: employeeChoices,
          },
        ])
        .then((answers) => {
          const { employeeId } = answers;

          // Retrieve the list of roles
          db.query("SELECT id, job_title FROM roles", (err, results) => {
            if (err) {
              console.error(err);
              mainMenu();
              return;
            }

            const roleChoices = results.map((result) => ({
              name: result.job_title,
              value: { id: result.id, jobTitle: result.job_title },
            }));

            // Prompt user to select a new role for the employee
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "newRole",
                  message: "Select a new role for the employee:",
                  choices: roleChoices,
                },
              ])
              .then((answers) => {
                const { newRole } = answers;
                const { id, jobTitle } = newRole;

                // Retrieve the salary and department name from the selected role
                db.query(
                  "SELECT salary, department_name FROM roles JOIN departments ON roles.department_id = departments.id WHERE roles.id = ?",
                  [id],
                  (err, results) => {
                    if (err) {
                      console.error(err);
                      mainMenu();
                      return;
                    }

                    if (results.length === 0) {
                      console.error("Role not found in the roles table");
                      mainMenu();
                      return;
                    }

                    const newRoleSalary = results[0].salary;
                    const newRoleDepartment = results[0].department_name;

                    // Update the employee's role, salary, and department
                    db.query(
                      "UPDATE employees SET title = ?, salary = ?, department = ? WHERE id = ?",
                      [jobTitle, newRoleSalary, newRoleDepartment, employeeId],
                      (err, result) => {
                        if (err) {
                          console.error(err);
                        } else {
                          console.log("Employee role updated successfully");
                        }
                        mainMenu();
                      }
                    );
                  }
                );
              });
          });
        })
        .catch((error) => {
          console.error(error);
          mainMenu();
        });
    }
  );
}
// Start the application
console.log("Welcome to your Employee Management System!");
mainMenu();
