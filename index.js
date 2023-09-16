const inquirer = require("inquirer");
const db = require("./db/connect");


db.connect(err => {
    if (err) throw err;
  console.log('Database connected.');
  companyForm(); 
});

const companyForm = () => {
    inquirer.prompt ([
        {
            type: "list",
            name: "startMenu",
            message: "Select an option",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
            ]
        }
        ])

        .then(reply => {
            const nextPrompt = reply.startMenu;

            if (nextPrompt === "View all departments") {
                viewDepartments();
            };

            if (nextPrompt === "View all roles") {
                viewRoles();
            };

            if (nextPrompt === "View all employees") {
                viewEmployees();
            };

            if (nextPrompt === "Add a department") {
                addDepartment();
            };

            if (nextPrompt === "Add a role") {
                addRole();
            };

            if (nextPrompt === "Add an employee") {
                addEmployee();
            };

            if (nextPrompt === "Update an employee role") {
                updateEmployee();
            };

            if (nextPrompt === "Exit") {
                process.exit();
            };
        })
};

const viewDepartments = () => {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.log("\n");
        console.table(rows);
        companyForm();
    });
};

const viewRoles = () => {
    const sql = `SELECT roles.id, 
                        roles.title, 
                        roles.salary, 
                        department.department_name AS department
                  FROM roles
                  LEFT JOIN department ON roles.department_id = department.id`;
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      console.log("\n");
      console.table(rows);
      companyForm();
    });
  };

const viewEmployees = () => {
    const sql = `SELECT employees.id,
                        employees.first_name,
                        employees.last_name,
                        roles.title AS title,
                        roles.salary AS salary,
                        department_name AS department,
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager 
                FROM employees
                LEFT JOIN roles ON employees.role_id = roles.id
                LEFT JOIN department ON roles.department_id = department.id
                LEFT JOIN employees manager ON employees.manager_id = manager.id`;
                     db.query(sql, (err, rows) => {
                    if (err) {
                      throw err;
                    }
                    console.log("\n");
                    console.table(rows);
                    companyForm();
                  });                
};

  const addDepartment = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "newDept",
            message: "Please enter the new department",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter department name");
                    return false;
                };
            }
        }
    ])
    .then (answer => {
        const sql = `INSERT INTO department (department_name) VALUES (?)`;
        const params = [answer.newDept];
        db.query(sql, params, (err) => {
            if (err) {
                throw err;
            }
            console.log("New department added");
            return viewDepartments();
        });
    });
};

    const addRole = () => {
        return inquirer.prompt([
            {
                type: "input",
                name: "newRole",
                message: "Please enter the new role",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("Please enter role name");
                        return false;
                    };
                }
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary for this role?",
                validate: salaryInput => {
                    if (isNaN(salaryInput)) {
                        console.log("Please enter a salary");
                        return false;
                    } else {
                        return true;
                    };
                }
            },
            {
                type: "input",
                name: "department",
                message: "Please enter the department id",
                validate: departmentInput => {
                    if (isNaN(departmentInput)) {
                        console.log("Please enter an ID");
                        return false;
                    } else {
                        return true;
                    };
                }
            }

        ])
        .then (answer => {
            const sql = 
            `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
            const params = [answer.newRole, answer.salary, answer.department];
            db.query(sql, params, (err) => {
                if (err) {
                    throw err;
                }
                console.log("New role added");
                return viewRoles();
            }); 
        });
};
