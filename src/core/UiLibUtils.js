import { buildUiLibSettings } from '../commons/bistro-cli-settings.js';
import { copyFiles, deleteFile } from './FileUtils.js';
import { executeCommand } from './ProcessUtils.js';

/**
 * Configures the UI library for a frontend project.
 *
 * This function initializes a shared UI library project by copying template files, installing dependencies, and performing other necessary setup tasks.
 *
 * @param {Object} settings - Configuration settings for the UI library.
 * @param {Function} settings.logger - A logging function to display messages.
 * @param {Object} settings.loggerFormatter - An object with formatting functions for log messages (e.g., colors).
 * @param {boolean} settings.hasSharedUiLib - Indicates whether a shared UI library is being used.
 * @param {string} settings.sharedUiLibProjectPath - The path to the shared UI library project directory.
 * @param {string} settings.frontendProjectPath - The path to the frontend project directory.
 * @param {string} settings.frontendRenderingType - The rendering type of the frontend project (e.g., "csr", "ssr", "ssg").
 * @param {string} settings.frontendStylingFramework - The styling framework used in the frontend project (e.g., "react", "angular").
 */
export const configureUiLib = (settings) => {
    const {
        logger,
        loggerFormatter,
        hasSharedUiLib,
        sharedUiLibProjectPath,
        frontendProjectPath,
        frontendRenderingType,
        frontendStylingFramework,
    } = settings;

    logger(loggerFormatter.blue(`Initializing Shared UI Library Project...`));

    const uiLibSettings = buildUiLibSettings(frontendStylingFramework, frontendRenderingType);

    if (!uiLibSettings) {
        logger(loggerFormatter.red('An error occurred while initializing UI Library'));
        throw Error('An error occurred while initializing UI Library');
    }

    const {
        dependencies,
        uiLibTemplateFilesPath,
        frontendModuleThemeFilesDestinationPath,
        sharedUiModuleThemeFilesDestinationPath,
    } = uiLibSettings;

    // copy required files inside main frontend
    if (uiLibTemplateFilesPath?.length) {
        copyFiles(
            uiLibTemplateFilesPath,
            `${frontendProjectPath}/${frontendModuleThemeFilesDestinationPath}`,
            {
                overwrite: null,
            },
        );
        deleteFile(`${frontendProjectPath}/${frontendModuleThemeFilesDestinationPath}/.gitkeep`);

        if (hasSharedUiLib) {
            copyFiles(
                uiLibTemplateFilesPath,
                `${sharedUiLibProjectPath}/${sharedUiModuleThemeFilesDestinationPath}`,
                {
                    overwrite: null,
                },
            );
            deleteFile(
                `${sharedUiLibProjectPath}/${sharedUiModuleThemeFilesDestinationPath}/.gitkeep`,
            );
        }
    }

    // install required dependencies inside main frontend
    if (dependencies?.length) {
        for (const dependency of dependencies) {
            const dependencyInstallCommand = !hasSharedUiLib
                ? `pnpm --prefix ${frontendProjectPath} add ${dependency}`
                : `pnpm --prefix ${frontendProjectPath} add ${dependency} && pnpm --prefix ${sharedUiLibProjectPath} add ${dependency}`;
            logger(loggerFormatter.blue(dependencyInstallCommand));

            const dependencyInstallStatus = executeCommand(dependencyInstallCommand)?.code;
            logger(loggerFormatter.blue(dependencyInstallStatus));
        }
    }

    logger(loggerFormatter.blue(`End of Shared UI Library Project initialization`));
};
