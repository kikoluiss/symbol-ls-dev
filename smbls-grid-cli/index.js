#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ejs from 'ejs';
import shell from 'shelljs';
import yargs from 'yargs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUESTIONS = [
    {
        name: 'name',
        type: 'input',
        message: 'Project name',
        when: () => !yargs().argv['name']
    },
    {
        name: 'rows',
        type: 'number',
        message: 'Number of Grid Rows'
    },
    {
        name: 'columns',
        type: 'number',
        message: 'Number of Grid Columns'
    },
];

const CURR_DIR = process.cwd();

inquirer.prompt(QUESTIONS)
    .then(answers => {
        answers = Object.assign({}, answers, yargs.argv);

        const projectName = answers['name'];
        const gridRows = answers['rows'];
        const gridCols = answers['columns'];
        const templatePath = path.join(__dirname, 'template');
        const targetPath = path.join(CURR_DIR, projectName);

        const options = {
            projectName,
            gridRows,
            gridCols,
            templatePath,
            targetPath,
        }

        console.log(options);

        if (!createProject(targetPath)) {
            return;
        }
        createDirectoryContents(templatePath, projectName, gridRows, gridCols);
        postProcess(options);

    });

function createProject(targetPath) {
    if (fs.existsSync(targetPath)) {
        console.log(chalk.red(`Folder ${targetPath} exists. Delete or use another name`));
        return false;
    }
    fs.mkdirSync(targetPath);
    return true;
}

const SKIP_FILES = ['node_modules', '.template.json'];

function createDirectoryContents(templatePath, projectName, gridRows, gridCols) {
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach(file => {
        const origFilePath = path.join(templatePath, file);

        const stats = fs.statSync(origFilePath);

        if (SKIP_FILES.indexOf(file) > -1) return;

        if (stats.isFile()) {
            let contents = fs.readFileSync(origFilePath, 'utf8');
            contents = templateRender(contents, { projectName, gridRows, gridCols });
            const writePath = path.join(CURR_DIR, projectName, file);
            fs.writeFileSync(writePath, contents, 'utf8');
        } else {
            fs.mkdirSync(path.join(CURR_DIR, projectName, file));
            createDirectoryContents(path.join(templatePath, file), path.join(projectName, file), gridRows, gridCols);
        }
    })
}

function templateRender(content, data) {
    return ejs.render(content, data);
}

function postProcess(options) {
    const isNode = fs.existsSync(path.join(options.templatePath, 'package.json'));
    if (isNode) {
        shell.cd(options.tartgetPath);
        const result = shell.exec('yarn install');
        if (result.code !== 0) {
            return false;
        }
    }    
    return true;
}
