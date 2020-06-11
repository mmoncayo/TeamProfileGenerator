const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

// establishes all variables
let role;
let name;
let id;
let github;
let email;
let officeNumber;
let school;


const employees = [];

// beginning prompt for establishing team members
const menu = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'Employee Role',
            message: "What is the person's role in the company? Or select 'No more employees' if there are no more people to add.",
            choices: ['Engineer', 'Intern', 'Manager', 'No more employees']
        },
    ]).then(workers => {

        //console.log(workers);

        role = workers['Employee Role'];
        //console.log(role);
        // next set of questions
        subMenu();
    })
}

// second prompted question is specific to the role of the team member
const subMenu = () => {

    switch (role) {

        case 'Engineer':
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'GitHub Username',
                    message: "What is the engineer's GitHub username?"
                }
            ]).then(handle => {

                //console.log(handle);
                github = handle["GitHub Username"];
                //console.log(github);
                subMenu2();
            })

            break;

        case 'Manager':
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'Office Number',
                    message: "What is the manager's office number?"
                }
            ]).then(office => {

                //console.log(office);
                officeNumber = office["Office Number"];
                //console.log(officeNumber);
                subMenu2();
            })

            break;

        case 'Intern':
            inquirer.prompt([
                {
                    type: 'input',
                    name: "School",
                    message: "Which school is the intern attending?"
                }
            ]).then(sponsor => {

                //console.log(sponsor);
                school = sponsor["School"];
                //console.log(school);
                subMenu2();
            })

            break;

        case 'No more employees':
            // at this point, when all team members have been accounted for, the html will be rendered based on the results of the team members inputs
            render(employees);
            let results = render(employees);
            console.log("Successfully generated your team's webpage!");
            return writeFileAsync(outputPath, results);

    }
}


// asks inputs about the employee's names, id numbers, and e-mail addresses
const subMenu2 = () => {

    inquirer.prompt([
        {
            type: 'input',
            name: 'Employee Name',
            message: "What is the employee's name?"
        },
        {
            type: 'input',
            name: 'Employee ID',
            message: "What is the employee ID number?",
            validate: function (val) {
                var valid = !isNaN(parseFloat(val));
                return valid || 'Please enter a number'
            }
        },
        {
            type: 'email',
            name: 'Employee Email',
            message: "What is the employee's email address?"
        },
    ]).then(answers => {

        name = answers['Employee Name'];
        //console.log(name);
        id = answers['Employee ID'];
        //console.log(id);
        email = answers['Employee Email'];
        //console.log(email);

        subMenu3();

    })

}

// once the questions have been answered, answers are pushed into the appropriate classes to construct their properties as 
// objects and are then returned to the main menu (first question to add more members if necessary)
const subMenu3 = () => {

    switch (role) {

        case 'Engineer':

            employees.push(new Engineer(name, id, email, github));

            menu();
            break;

        case 'Intern':

            employees.push(new Intern(name, id, email, school));

            menu();
            break;

        case 'Manager':

            employees.push(new Manager(name, id, email, officeNumber));

            menu();
            break;

    }
}

// initiates the prompted questions 
menu();
