import chalk from 'chalk';
import figlet from 'figlet';
import ora from 'ora';
import prompts from 'prompts';

// For interactive user prompts
import {
    buildProjectConfig,
    createCommonProjectStructure,
    createMonorepoProjectStructure,
} from '../commons/bistro-cli-utils.js';
import { BistroProjectStructureQuestions } from '../commons/bistro-project-structure-questions.js';
import AppLogger from '../core/AppLogger.js';
import { configureAngularApplication } from '../project-angular/bistro-project-angular-cli.js';
import { configureReactApplication } from '../project-react/bistro-project-react-cli.js';

const info = AppLogger.info; // Define log for console output

/**
 * Prompts the user for project structure details, builds the configuration, and creates the initial project structure.
 * @async
 * @returns {Promise<void>} A Promise that resolves when the project structure is created.
 */
export const createProjectStructure = async () => {
    // Display a Welcome Message
    // eslint-disable-next-line no-console,no-undef
    console.log(
        chalk.hex('#880e4f')(
            figlet.textSync('Welcome to Bistro Kit!', {
                font: 'ANSI Regular',
                horizontalLayout: 'default',
                verticalLayout: 'default',
                whitespaceBreak: true,
            }),
        ),
    );

    // Prompt the user for project details
    const responses = await prompts(BistroProjectStructureQuestions);
    if (!responses) {
        // Handle missing responses
        info(chalk.red('You did not answer required questions!'));
        throw Error(`You did not answer required questions`);
    }

    // Parse and validate user settings
    const { settings, error } = buildProjectConfig(responses);
    if (error?.length || !settings) {
        // Handle configuration errors
        info(chalk.red(error || `You did not answer required questions`));
        throw Error(error || `You did not answer required questions`);
    }

    // Extract project settings
    // frontendFramework
    const { isMonorepoProject, frontendFramework } = settings;

    // Start a loading spinner to indicate progress
    const projectStructureSpinner = ora(`Creating your project in progress`).start();

    // create common structure
    createCommonProjectStructure(settings);

    // create monorepo structure
    if (isMonorepoProject) {
        createMonorepoProjectStructure(settings);
    }

    // configure framework settings
    if (frontendFramework === 'react') {
        await configureReactApplication({
            ...settings,
            logger: info,
            loggerFormatter: chalk,
        });
    } else if (frontendFramework === 'angular') {
        await configureAngularApplication({
            ...settings,
            logger: info,
            loggerFormatter: chalk,
        });
    }

    // Stop the spinner when the project structure creation is complete
    projectStructureSpinner.stop();
};
