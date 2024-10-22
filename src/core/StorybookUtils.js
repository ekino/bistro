import { executeCommand } from './ProcessUtils.js';

/**
 * Configures a shared Storybook project.
 *
 * This function initializes a Storybook project in the specified directory if the `hasSharedStorybook` flag is set to true.
 * It uses the provided framework and builder to generate the Storybook project.
 *
 * @param {Object} settings - Configuration settings for the shared Storybook project.
 * @param {Function} settings.logger - A logging function to display messages.
 * @param {Object} settings.loggerFormatter - An object with formatting functions for log messages (e.g., colors).
 * @param {boolean} settings.hasSharedStorybook - Indicates whether a shared Storybook project should be configured.
 * @param {string} settings.sharedStorybookProjectPath - The path to the shared Storybook project directory.
 * @param {string} settings.frontendFramework - The frontend framework used in the project (e.g., "react", "angular").
 * @param {string} [settings.builder='vite'] - The builder to use for Storybook (e.g., "webpack5", "vite"). Defaults to 'vite'.
 */
export const configureSharedStorybook = (settings) => {
    const {
        logger,
        loggerFormatter,
        hasSharedStorybook,
        sharedStorybookProjectPath,
        frontendFramework,
        builder,
    } = settings;

    if (!hasSharedStorybook) {
        return;
    }

    logger(loggerFormatter.blue(`Initializing Storybook project...`));

    const storybookInitCommand = `cd ${sharedStorybookProjectPath} && pnpm dlx storybook@latest init --type ${frontendFramework} --builder ${builder || 'vite'} --yes --no-dev`;
    logger(loggerFormatter.blue(storybookInitCommand));

    const storybookInitStatus = executeCommand(storybookInitCommand)?.code;
    logger(loggerFormatter.blue(storybookInitStatus));

    if (storybookInitStatus !== 0) {
        logger(loggerFormatter.red('An error occurred while initializing Storybook project'));
        throw Error('An error occurred while initializing Storybook project');
    }

    logger(loggerFormatter.green(`End of Storybook project initialization`));
};
