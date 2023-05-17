const inquirer = require("inquirer");

const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

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
          "Update an Employee Manager",
          "View Employees by Manager",
          "Remove a Department",
          "Remove a Role",
          "Remove an Employee",
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
        case "Update an Employee Manager":
          updateEmployeeManager();
          break;
        case "View Employees by Manager":
          viewEmployeesByManager();
          break;
        case "Remove a Department":
          removeDepartment();
          break;
        case "Remove a Role":
          removeRole();
          break;
        case "Remove an Employee":
          removeEmployee();
          break;
        case "Exit":
          console.log("Goodbye!");
          process.exit(0);
      }
    });
}

// define functions that will be called in the switch statement above
function viewAllRoles() {
  console.log("Viewing all roles");
  db.query("SELECT * FROM roles", function (err, results) {
    console.table(results);
  });
  mainMenu();
}

function viewAllEmployees() {
  console.log("Viewing all employees");
  db.query("SELECT * FROM employees", function (err, results) {
    console.table(results);
  });
  mainMenu();
}

function viewAllDepartments() {
    console.log("Viewing all departments");\
    db.query("SELECT * FROM departments", function (err, results) {
        console.table(results);
    });
    mainMenu();
}

function addDepartment() {
    console.log("Adding a department");
    inquirer
      .prompt([
        {
          type: "input",
          name: "department",
          message: "What is the name of the department you would like to add?",
        },
      ])
      .then((answers) => {
        const departmentName = answers.department;
  
        db.query("INSERT INTO departments (department_name) VALUES (?)", [departmentName], (err, result) => {
          if (err) {
            console.error(err);
            mainMenu();
            return;
          }
          console.log(`Department "${departmentName}" added successfully`);
          mainMenu();
        });
      })
      .catch((error) => {
        console.error(error);
        mainMenu();
      });
  }

// Add other route functions for the remaining actions

// Start the application
console.log("Welcome to your Employee Management System!");
mainMenu();
