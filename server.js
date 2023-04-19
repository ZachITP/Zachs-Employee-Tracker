const inquirer = require("inquirer");
const db = require("./db/connection");
require("dotenv").config();

// Start the prompt functions
function runprompt() {
  inquirer
    .prompt({
      type: "list",
      name: "menu",
      message: "Select an operation",
      choices: [
        "See All Departments",
        "See All Roles",
        "See All Employees",
        "Add A Department",
        "Add A Role",
        "Add An Employee",
        "Update An Employee Role",
        "Update An Employee Manager",
        "Delete Department",
        "Delete Role",
        "Delete Employee",
      ],
    })
    .then((answer) => {
      switch (answer.menu) {
        case "See All Departments":
          seeAllDepartments();
          break;
        case "See All Roles":
          seeAllRoles();
          break;
        case "See All Employees":
          seeAllEmployees();
          break;
        case "Add A Department":
          addDepartment();
          break;
        case "Add A Role":
          addRole();
          break;
        case "Add An Employee":
          addEmployee();
          break;
        case "Update An Employee Role":
          updateEmployeeRole();
          break;
        case "Update An Employee Manager":
          updateEmployeeManager();
          break;
        case "Delete a Department":
          deleteDepartment();
          break;
        case "Delete a Role":
          deleteRole();
          break;
        case "Delete an Employee":
          deleteEmployee();
          break;
      }
    });
}

// See all departments
function seeAllDepartments() {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.table(result);
    runprompt();
  });
}

// See all roles
function seeAllRoles() {
  const sql = `SELECT * FROM role`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.table(result);
    runprompt();
  });
}

// See all employees
function seeAllEmployees() {
  //all the options you have with the employee
  const sql = `SELECT employee.id,
                employee.first_name,
                employee.last_name,
                role.title AS job_title,
                department.department_name,
                role.salary,
                CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee AS manager ON employee.manager_id = manager.id
                ORDER By employee.id`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.table(result);
    runprompt();
  });
}

// Add a department to the database
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "department_name",
        type: "input",
        message:
          "Please enter the name of the department you want to add to the database.",
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department (department_name)
                VALUES (?)`;
      const params = [answer.department_name];
      db.query(sql, params, (err, result) => {
        if (err) throw err;
        console.log(
          "The new department entered has been added successfully to the database."
        );

        db.query(`SELECT * FROM department`, (err, result) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          console.table(result);
          runprompt();
        });
      });
    });
}

// Add a role to the database
function addRole() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message:
          "Please enter the title of role you want to add to the database.",
      },
      {
        name: "salary",
        type: "input",
        message:
          "Please enter the salary associated with the role you want to add to the database. (no dots, space or commas)",
      },
      {
        name: "department_id",
        type: "number",
        message:
          "Please enter the department's id associated with the role you want to add to the database.",
      },
    ])
    .then(function (response) {
      db.query(
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
        [response.title, response.salary, response.department_id],
        function (err, data) {
          if (err) throw err;
          console.log(
            "The new role entered has been added successfully to the database."
          );

          db.query(`SELECT * FROM role`, (err, result) => {
            if (err) {
              res.status(500).json({ error: err.message });
              runprompt();
            }
            console.table(result);
            runprompt();
          });
        }
      );
    });
}

// Add employees to the database
function addEmployee() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message:
          "Please enter the first name of the employee you want to add to the database.",
      },
      {
        name: "last_name",
        type: "input",
        message:
          "Please enter the last name of the employee you want to add to the database.",
      },
      {
        name: "role_id",
        type: "number",
        message:
          "Please enter the employee's role you want to add to the database. Enter ONLY numbers.",
      },
      {
        name: "manager_id",
        type: "number",
        message:
          "Please enter the manager's id associated with the employee you want to add to the database. Enter ONLY numbers.",
      },
    ])
    .then(function (response) {
      db.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        [
          response.first_name,
          response.last_name,
          response.role_id,
          response.manager_id,
        ],
        function (err, data) {
          if (err) throw err;
          console.log(
            "The new employee has been successfully added to the database."
          );

          db.query(`SELECT * FROM employee`, (err, result) => {
            if (err) {
              res.status(500).json({ error: err.message });
              runprompt();
            }
            console.table(result);
            runprompt();
          });
        }
      );
    });
}

// Update employee role
function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message:
          "Please enter the employee's first name you want update in the database.",
      },
      {
        name: "role_id",
        type: "number",
        message:
          "Please enter the new role number id associated with the employee you want to update in the database. Enter ONLY numbers.",
      },
    ])
    .then(function (response) {
      db.query(
        "UPDATE employee SET role_id = ? WHERE first_name = ?",
        [response.role_id, response.first_name],
        function (err, data) {
          if (err) throw err;
          console.log(
            "The new role entered has been added successfully to the database."
          );

          db.query(`SELECT * FROM employee`, (err, result) => {
            if (err) {
              res.status(500).json({ error: err.message });
              runprompt();
            }
            console.table(result);
            runprompt();
          });
        }
      );
    });
}

// Update employee manager
function updateEmployeeManager() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message:
          "Please enter the first name of the employee you want update in the database.",
      },
      {
        name: "manager_id",
        type: "number",
        message:
          "Please enter the new manager's id number associated with the employee you want to update in the database. Enter ONLY numbers.",
      },
    ])
    .then(function (response) {
      db.query(
        "UPDATE employee SET manager_id = ? WHERE first_name = ?",
        [response.manager_id, response.first_name],
        function (err, data) {
          if (err) throw err;
          console.log("The new manager's id has been added to the database.");

          db.query(`SELECT * FROM employee`, (err, result) => {
            if (err) {
              res.status(500).json({ error: err.message });
              runprompt();
            }
            console.table(result);
            runprompt();
          });
        }
      );
    });
}

// Delete a department
function deleteDepartment() {
  inquirer
    .prompt([
      {
        name: "department_id",
        type: "number",
        message:
          "Please enter the id of the department you want to delete from the database. Enter ONLY numbers.",
      },
    ])
    .then(function (response) {
      db.query(
        "DELETE FROM department WHERE id = ?",
        [response.department_id],
        function (err, data) {
          if (err) throw err;
          console.log(
            "The department entered has been deleted successfully from the database."
          );

          db.query(`SELECT * FROM department`, (err, result) => {
            if (err) {
              res.status(500).json({ error: err.message });
              runprompt();
            }
            console.table(result);
            runprompt();
          });
        }
      );
    });
}

// Delete a role
function deleteRole() {
  inquirer
    .prompt([
      {
        name: "role_id",
        type: "number",
        message:
          "Please enter the role ID that you wish to delete from the database. Enter ONLY numbers.",
      },
    ])
    .then(function (response) {
      db.query(
        "DELETE FROM role WHERE id = ?",
        [response.role_id],
        function (err, data) {
          if (err) throw err;
          console.log(
            "The role entered has been deleted successfully from the database."
          );

          db.query(`SELECT * FROM role`, (err, result) => {
            if (err) {
              res.status(500).json({ error: err.message });
              runprompt();
            }
            console.table(result);
            runprompt();
          });
        }
      );
    });
}

// Delete an Employee
function deleteEmployee() {
  inquirer
    .prompt([
      {
        name: "employee_id",
        type: "number",
        message:
          "Please enter the employees ID number that you wish to delete. Enter ONLY numbers.",
      },
    ])
    .then(function (response) {
      db.query(
        "DELETE FROM employee WHERE id = ?",
        [response.employee_id],
        function (err, data) {
          if (err) throw err;
          console.log(
            "The employee number entered has been deleted successfully from the database."
          );

          db.query(`SELECT * FROM employee`, (err, result) => {
            if (err) {
              res.status(500).json({ error: err.message });
              runprompt();
            }
            console.table(result);
            runprompt();
          });
        }
      );
    });
}

runprompt();
