import { execSync } from 'child_process';

import {
    copyFiles,
    createDirectory,
    readFileContent,
    writeContentToFile,
} from '../core/FileUtils.js';

/**
 * The root directory of the project.
 * @type {string}
 */
const rootPath = '.';

/**
 * The directory where project templates are stored.
 * @type {string}
 */
const templateRootPath = './templates';

/**
 * Contains the paths to the source directories for various frontend frameworks and rendering types.
 * @type {Object}
 */
const frontendSettings = {
    /**
     * Source directories for different frontend frameworks and rendering types.
     * @type {Object}
     */
    sourceDir: {
        /**
         * Source directories for React projects.
         * @type {Object}
         */
        react: {
            /**
             * Path to the template for a React Client-Side Rendered (CSR) project.
             * @type {string}
             */
            csr: `${templateRootPath}/base-react-structure`,
            /**
             * Path to the template for a React Server-Side Rendered (SSR) project.
             * @type {string}
             */
            ssr: `${templateRootPath}/base-react-ssr-structure`,
            /**
             * Path to the template for a React Static Site Generated (SSG) project.
             * @type {string}
             */
            ssg: `${templateRootPath}/base-react-ssr-structure`,
        },
        /**
         * Source directories for Angular projects.
         * @type {Object}
         */
        angular: {
            /**
             * Path to the template for an Angular Client-Side Rendered (CSR) project.
             * @type {string}
             */
            csr: `${templateRootPath}/base-angular-structure`,
            /**
             * Path to the template for an Angular Server-Side Rendered (SSR) project.
             * @type {string}
             */
            ssr: `${templateRootPath}/base-angular-ssr-structure`,
            /**
             * Path to the template for an Angular Static Site Generated (SSG) project.
             * @type {string}
             */
            ssg: `${templateRootPath}/base-angular-ssr-structure`,
        },
    },
};

/**
 * Contains settings related to library creation.
 * @type {Object}
 */
const libSettings = {
    /**
     * The source directory for library templates
     * @type {string}
     */
    sourceDir: `${templateRootPath}/base-lib-structure`,
    /**
     * The path to the package.json file within the library template.
     * @type {string}
     */
    packageJson: `${templateRootPath}/base-lib-structure/package.json`,
};

/**
 * Checks if the given configuration represents a monorepo project.
 * This function looks for the specific configuration key 'project-monorepo' to determine if it's a monorepo.
 * @param {Object} config - The project configuration object.
 * @returns {boolean} True if it's a monorepo, false otherwise.
 */
export const isMonorepo = (config) => config?.[0]?.['project-monorepo'] || false;

/**
 * Builds the project configuration based on user responses.
 * This function constructs project paths and settings based on user responses.
 * @param {Object} responses - The user responses from the project setup.
 * @returns {Object} An object containing the project settings or an error message.
 */
export const buildProjectConfig = (responses) => {
    // Extract project name, organization, and acronym from user responses
    const projectName = responses['project-name'];
    const projectOrganization = responses['project-organization'];
    const projectAcronym = responses['project-acronym'];
    const frontendFramework = responses['frontend-framework'];
    const frontendRenderingType = responses['frontend-rendering-type'];

    // Check if project details are provided
    if (!projectName?.length) {
        return {
            settings: null,
            error: 'Project name is a required information to generate your git project!',
        };
    }
    if (!projectOrganization?.length) {
        return {
            settings: null,
            error: 'Project organization is a required information to generate your git project!',
        };
    }
    if (!projectAcronym?.length) {
        return {
            settings: null,
            error: 'Project acronym is a required information to generate your git project!',
        };
    }
    if (!frontendFramework?.length) {
        return {
            settings: null,
            error: 'Project frontend framework is a required information to generate the settings!',
        };
    }
    if (!frontendRenderingType?.length) {
        return {
            settings: null,
            error: 'Frontend Rendering Type is a required information to generate the settings!',
        };
    }

    // verify if user want to create monorepo
    const isMonorepoProject = responses['project-monorepo'];

    // Construct paths for project root
    const projectRootPath = isMonorepoProject
        ? `${rootPath}/${projectName}/src`
        : `${rootPath}/${projectName}`; // Root path of the project
    const projectRepository = projectName;

    // Construct frontend settings
    let frontendProjectPath = isMonorepoProject
        ? `${projectRootPath}/${projectAcronym}-front`
        : projectRootPath;
    const frontendProjectName = isMonorepoProject ? 'front' : projectName;
    const frontendPackageJsonPath = `${frontendProjectPath}/package.json`;

    if (!isMonorepoProject) {
        return {
            settings: {
                isMonorepoProject,
                projectRootPath,
                projectName,
                projectOrganization,
                projectAcronym,
                projectRepository,
                frontendProjectName,
                frontendProjectPath,
                frontendPackageJsonPath,
                frontendFramework,
                frontendRenderingType,
            },
            error: null,
        };
    }

    // optional settings
    const hasSharedUtilsLib = (isMonorepoProject && responses['shared-utils-lib']) || false;
    const hasSharedStorybook = (isMonorepoProject && responses['shared-storybook']) || false;
    const hasSharedUiLib = (isMonorepoProject && responses['shared-ui-lib']) || false;

    // shared utils lib settings
    const sharedUtilsLibProjectPath = hasSharedUtilsLib
        ? `${projectRootPath}/${projectAcronym}-commons`
        : null;
    const sharedUtilsLibProjectName = hasSharedUtilsLib ? 'commons' : null;
    const sharedUtilsLibPackageJsonPath = hasSharedUtilsLib
        ? `${sharedUtilsLibProjectPath}/package.json`
        : null;

    // storybook settings
    const sharedStorybookProjectPath = hasSharedStorybook
        ? `${projectRootPath}/${projectAcronym}-storybook`
        : null;
    const sharedStorybookProjectName = hasSharedStorybook ? 'storybook' : null;
    const sharedStorybookPackageJsonPath = hasSharedStorybook
        ? `${sharedStorybookProjectPath}/package.json`
        : null;

    // shared ui lib settings
    const sharedUiLibProjectPath = hasSharedUiLib
        ? `${projectRootPath}/${projectAcronym}-ui-commons`
        : null;
    const sharedUiLibProjectName = hasSharedUiLib ? 'ui-commons' : null;
    const sharedUiLibPackageJsonPath = hasSharedUiLib
        ? `${sharedUiLibProjectPath}/package.json`
        : null;

    // others frontend options
    const frontendStateManagementFramework = responses['frontend-state-management-framework'];
    const frontendStylingFramework = responses['frontend-styling-framework'];
    const frontendE2EFramework = responses['frontend-e2e-framework'];
    const frontendSchemaValidationFramework = responses['frontend-schema-validation-framework'];

    // Return the project configuration object with all paths and settings
    return {
        settings: {
            isMonorepoProject,
            projectRootPath,
            projectName,
            projectOrganization,
            projectAcronym,
            projectRepository,
            frontendProjectName,
            frontendProjectPath,
            frontendPackageJsonPath,
            frontendFramework,
            frontendRenderingType,
            frontendStateManagementFramework,
            frontendStylingFramework,
            frontendE2EFramework,
            frontendSchemaValidationFramework,
            hasSharedUtilsLib,
            hasSharedStorybook,
            hasSharedUiLib,
            sharedUtilsLibProjectName,
            sharedUtilsLibProjectPath,
            sharedUtilsLibPackageJsonPath,
            sharedStorybookProjectName,
            sharedStorybookProjectPath,
            sharedStorybookPackageJsonPath,
            sharedUiLibProjectName,
            sharedUiLibProjectPath,
            sharedUiLibPackageJsonPath,
        },
        error: null,
    };
};

/**
 * Updates a package.json file with project-specific details.
 * This function replaces placeholders in the package.json with actual project details.
 *
 * @param {Object} options - The configuration options for updating the package.json file.
 * @param {string} options.sourcePackageJsonPath - The path to the source package.json template file.
 * @param {string} options.destinationProjectPath - The path to the destination project directory.
 * @param {string} options.destinationPackageJsonPath - The path to the destination package.json file.
 * @param {string} options.destinationProjectName - The name of the project.
 * @param {string} options.destinationProjectOrganization - The organization name for the project.
 * @param {string} options.destinationRepository - The repository URL for the project.
 * @param {string} options.destinationProjectAcronym - The acronym of the project.
 */
const updatePackageJson = ({
    sourcePackageJsonPath,
    destinationProjectPath,
    destinationPackageJsonPath,
    destinationProjectName,
    destinationProjectOrganization,
    destinationRepository,
    destinationProjectAcronym,
}) => {
    // Read the source package.json file
    const updatedPackageJsonContent = readFileContent(sourcePackageJsonPath)
        .replaceAll('project-organization', destinationProjectOrganization)
        .replaceAll('project-name', destinationProjectName)
        .replaceAll('project-acronym', destinationProjectAcronym)
        .replaceAll('project-repo', destinationRepository);

    // Write the updated content to the destination package.json
    writeContentToFile(destinationPackageJsonPath, updatedPackageJsonContent);

    // launch pnpm install
    if (destinationProjectPath?.length) {
        execSync(`pnpm --prefix=${destinationProjectPath} i`, {
            stdio: 'inherit',
        });
    }
};

/**
 * Copies template files to the destination project and updates package.json.
 * @param {Object} options - Options for copying files.
 * @param {string} options.destinationFrontendFramework - The frontend framework to use.
 * @param {string} options.destinationFrontendRenderingType - The frontend rendering type (CSR, SSR, SSG).
 * @param {string} options.destinationProjectPath - The path to the destination project directory.
 * @param {string} options.destinationPackageJsonPath - The path to the destination package.json file.
 * @param {string} options.destinationProjectName - The name of the destination project.
 * @param {string} options.destinationProjectOrganization - The organization of the destination project.
 * @param {string} options.destinationRepository - The git repository name of the destination project.
 * @param {string} options.destinationProjectAcronym - The acronym of the destination project.
 */
export const createFrontendProjectStructure = ({
    destinationFrontendFramework,
    destinationFrontendRenderingType,
    destinationProjectPath,
    destinationPackageJsonPath,
    destinationProjectName,
    destinationProjectOrganization,
    destinationRepository,
    destinationProjectAcronym,
}) => {
    // copy files from template
    const templateFrontSourcePath =
        frontendSettings.sourceDir[destinationFrontendFramework][destinationFrontendRenderingType];
    copyFiles(templateFrontSourcePath, destinationProjectPath);

    // update package json according to user inputs
    const templateFrontPackageJsonPath = `${templateFrontSourcePath}/package.json`; // Path to frontend template package.json
    updatePackageJson({
        sourcePackageJsonPath: templateFrontPackageJsonPath,
        destinationProjectPath,
        destinationPackageJsonPath,
        destinationProjectName,
        destinationProjectOrganization,
        destinationRepository,
        destinationProjectAcronym,
    });
};

/**
 * Copies lib template files to the destination project and updates package.json.
 * @param {Object} options - Options for copying files.
 * @param {string} options.destinationProjectPath - The path to the destination project directory.
 * @param {string} options.destinationPackageJsonPath - The path to the destination package.json file.
 * @param {string} options.destinationProjectName - The name of the destination project.
 * @param {string} options.destinationProjectOrganization - The organization of the destination project.
 * @param {string} options.destinationRepository - The git repository name of the destination project.
 * @param {string} options.destinationProjectAcronym - The acronym of the destination project.
 */
export const createLibDestinationStructure = ({
    destinationProjectPath,
    destinationPackageJsonPath,
    destinationProjectName,
    destinationProjectOrganization,
    destinationRepository,
    destinationProjectAcronym,
}) => {
    // copy files from template
    copyFiles(libSettings.sourceDir, destinationProjectPath);

    // update package json according to user inputs
    updatePackageJson({
        sourcePackageJsonPath: libSettings.packageJson,
        destinationProjectPath,
        destinationPackageJsonPath,
        destinationProjectName,
        destinationProjectOrganization,
        destinationRepository,
        destinationProjectAcronym,
    });
};

/**
 * Creates the structure for a monorepo project by conditionally copying files for shared libraries.
 * @param {Object} settings - The project settings object.
 * @param {string} settings.projectOrganization - The project organization name.
 * @param {string} settings.projectAcronym - The project acronym.
 * @param {string} settings.sharedUtilsLibProjectName - The name of the shared utilities library project.
 * @param {string} settings.sharedUtilsLibProjectPath - The path of the shared utilities library project.
 * @param {string} settings.sharedUtilsLibPackageJsonPath - The path of the package.json file for the shared utilities library project.
 * @param {string} settings.sharedStorybookProjectName - The name of the shared Storybook project.
 * @param {string} settings.sharedStorybookProjectPath - The path of the shared Storybook project.
 * @param {string} settings.sharedStorybookPackageJsonPath - The path of the package.json file for the shared Storybook project.
 * @param {string} settings.sharedUiLibProjectName - The name of the shared UI library project.
 * @param {string} settings.sharedUiLibProjectPath - The path of the shared UI library project.
 * @param {string} settings.sharedUiLibPackageJsonPath - The path of the package.json file for the shared UI library project.
 * @param {boolean} settings.hasSharedUtilsLib - Indicates whether the project has a shared utilities' library.
 * @param {boolean} settings.hasSharedStorybook - Indicates whether the project has a shared Storybook.
 * @param {boolean} settings.hasSharedUiLib - Indicates whether the project has a shared UI library.
 */
export const createMonorepoProjectStructure = (settings) => {
    const {
        isMonorepoProject,
        projectName,
        projectAcronym,
        projectOrganization,
        projectRepository,
        sharedUtilsLibProjectName,
        sharedUtilsLibProjectPath,
        sharedUtilsLibPackageJsonPath,
        sharedStorybookProjectName,
        sharedStorybookProjectPath,
        sharedStorybookPackageJsonPath,
        sharedUiLibProjectName,
        sharedUiLibProjectPath,
        sharedUiLibPackageJsonPath,
        hasSharedUtilsLib,
        hasSharedStorybook,
        hasSharedUiLib,
    } = settings;

    if (!isMonorepoProject) {
        return;
    }

    // copy pnpm workspace files
    copyFiles(`${templateRootPath}/pnpm-workspace.yaml`, `./${projectName}/pnpm-workspace.yaml`, {
        overwrite: null,
    });

    // optional shared utils lib
    if (hasSharedUtilsLib) {
        createLibDestinationStructure({
            destinationProjectPath: sharedUtilsLibProjectPath,
            destinationPackageJsonPath: sharedUtilsLibPackageJsonPath,
            destinationProjectName: `@${projectAcronym}/${sharedUtilsLibProjectName}`,
            destinationProjectOrganization: projectOrganization,
            destinationRepository: projectRepository,
            destinationProjectAcronym: projectAcronym,
        });
    }

    // optional shared ui lib
    if (hasSharedUiLib) {
        createLibDestinationStructure({
            destinationProjectPath: sharedUiLibProjectPath,
            destinationPackageJsonPath: sharedUiLibPackageJsonPath,
            destinationProjectName: `@${projectAcronym}/${sharedUiLibProjectName}`,
            destinationProjectOrganization: projectOrganization,
            destinationRepository: projectRepository,
            destinationProjectAcronym: projectAcronym,
        });
    }

    // optional shared storybook
    if (hasSharedStorybook) {
        createLibDestinationStructure({
            destinationProjectPath: sharedStorybookProjectPath,
            destinationPackageJsonPath: sharedStorybookPackageJsonPath,
            destinationProjectName: `@${projectAcronym}/${sharedStorybookProjectName}`,
            destinationProjectOrganization: projectOrganization,
            destinationRepository: projectRepository,
            destinationProjectAcronym: projectAcronym,
        });
    }
};

/**
 * Creates the common project structure (frontend) by copying template files and updating package.json.
 * @param {Object} settings - The project settings object.
 * @param {string} settings.projectOrganization - The project organization name.
 * @param {string} settings.projectAcronym - The project acronym.
 * @param {string} settings.frontendProjectName - The name of the frontend project.
 * @param {string} settings.frontendProjectPath - The path of the frontend project.
 * @param {string} settings.frontendPackageJsonPath - The path of the package.json file for the frontend project.
 */
export const createCommonProjectStructure = (settings) => {
    const {
        projectRootPath,
        projectName,
        projectAcronym,
        projectOrganization,
        projectRepository,
        frontendProjectName,
        frontendProjectPath,
        frontendPackageJsonPath,
        frontendFramework,
        frontendRenderingType,

        // frontendStateManagementFramework,
        // frontendStylingFramework,
        // frontendE2EFramework,
        // frontendSchemaValidationFramework,
    } = settings;

    // create root project
    createDirectory(projectRootPath, { recursive: true });

    // copy commons files
    copyFiles([`${templateRootPath}/.gitignore`], `./${projectName}/.gitignore`, {
        overwrite: null,
    });

    // update common config
    updatePackageJson({
        sourcePackageJsonPath: `${templateRootPath}/package.json`,
        destinationPackageJsonPath: `./${projectName}/package.json`,
        destinationProjectName: projectName?.toLowerCase(),
        destinationProjectOrganization: projectOrganization,
        destinationRepository: projectRepository,
        destinationProjectAcronym: projectAcronym,
    });

    // create frontend module
    createFrontendProjectStructure({
        destinationFrontendFramework: frontendFramework,
        destinationFrontendRenderingType: frontendRenderingType,
        destinationProjectPath: frontendProjectPath,
        destinationPackageJsonPath: frontendPackageJsonPath,
        destinationProjectName: `@${projectAcronym}/${frontendProjectName}`,
        destinationProjectOrganization: projectOrganization,
        destinationProjectAcronym: projectAcronym,
        destinationRepository: projectRepository,
    });
};
