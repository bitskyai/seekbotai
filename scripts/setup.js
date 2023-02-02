/*
 * This script helps to configure all the required
 * environment variables such as application URL (origin),
 *
 *   $ yarn setup
 */

import inquirer from "inquirer";

const questions = [
    {
        type: "confirm",
        name: "setup",
        message: "Configure this project for local development, test (QA), and production environments?",
        default: true,
    },
];

async function done() {
    console.log(`  `);
    console.log(`  $ yarn api:start`);
    console.log(`  $ yarn web:start`);
    console.log(`  `);
}

inquirer
    .prompt(questions)
    .then(done)
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
