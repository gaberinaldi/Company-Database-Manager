const db = require("../db/connection");
const inquirer = require("inquirer");

const companyForm = () => {
    inquirer.prompt ([
        {
            type: "list",
            name: "startMenu",
            message: "Select an option",
            choices: [
                
            ]
        }
        ]
    )
}