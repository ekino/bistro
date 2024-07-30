import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';

// For interactive user prompts
import {
    buildProjectConfig,
    createCommonProjectStructure,
    createMonorepoProjectStructure,
} from '../commons/bistro-cli-utils.js';
import { BistroProjectStructureQuestions } from '../commons/bistro-project-structure-questions.js';

// eslint-disable-next-line no-console,no-undef
const log = console.log; // Define log for console output

/**
 * Prompts the user for project structure details, builds the configuration, and creates the initial project structure.
 * @async
 * @returns {Promise<void>} A Promise that resolves when the project structure is created.
 */
export const createProjectStructure = async () => {
    // Prompt the user for project details
    const responses = await prompts(BistroProjectStructureQuestions);
    if (!responses) {
        // Handle missing responses
        log(chalk.red('You did not answer required questions!'));
        throw Error(`You did not answer required questions`);
    }

    // Parse and validate user settings
    const { settings, error } = buildProjectConfig(responses);
    if (error?.length || !settings) {
        // Handle configuration errors
        log(chalk.red(error || `You did not answer required questions`));
        throw Error(error || `You did not answer required questions`);
    }

    // Extract project settings
    // frontendFramework
    const { isMonorepoProject } = settings;

    // Start a loading spinner to indicate progress
    const projectStructureSpinner = ora(`Creating your project in progress`).start();

    // create common structure
    createCommonProjectStructure(settings);

    // create monorepo structure
    if (isMonorepoProject) {
        createMonorepoProjectStructure(settings);
    }

    // TODO: Handle frontendFramework specific logic
    // console.log(frontendFramework);

    // Stop the spinner when the project structure creation is complete
    projectStructureSpinner.stop();
};
