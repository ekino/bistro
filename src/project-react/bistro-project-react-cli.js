import { executeCommand } from '../core/ProcessUtils.js';

export const configureReactApplication = async (settings) => {
    if (!settings) {
        return false;
    }

    const {
        logger,
        loggerFormatter,
        hasSharedUtilsLib,
        hasSharedStorybook,
        hasSharedUiLib,
        sharedStorybookProjectPath,
    } = settings;

    if (hasSharedStorybook) {
        logger(loggerFormatter.blue(`Initializing Storybook project...`));

        const storybookInitCommand = `npx storybook@latest init --type react --builder vite --yes --no-dev`;
        logger(loggerFormatter.blue(storybookInitCommand));

        executeCommand(`cd ${sharedStorybookProjectPath}`);

        const storybookInitStatus = executeCommand(storybookInitCommand)?.code;
        logger(loggerFormatter.blue(storybookInitStatus));

        if (storybookInitStatus !== 0) {
            logger(loggerFormatter.red('An error occurred while initializing Storybook project'));
            throw Error('An error occurred while initializing Storybook project');
        }
    }
};
