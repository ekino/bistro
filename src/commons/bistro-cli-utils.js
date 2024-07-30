import fs from 'fs-extra';

/**
 * Checks if the given configuration represents a monorepo project.
 * @param {Object} config - The project configuration object.
 * @returns {boolean} True if it's a monorepo, false otherwise.
 */
export const isMonorepo = (config) => config?.[0]?.['project-monorepo'] || false;

// Define constant paths for project templates and files
const rootPath = '.'; // The root directory of the project
const templateRootPath = './templates'; // The directory where project templates are stored
const templateFrontSourcePath = `${templateRootPath}/front-structure`; // Path to frontend template files
const templateFrontPackageJsonPath = `${templateFrontSourcePath}/package.json`; // Path to frontend template package.json
const templateLibSourcePath = `${templateRootPath}/lib-structure`; // Path to library template files
const templateLibPackageJsonPath = `${templateLibSourcePath}/package.json`; // Path to library template package.json

/**
 * Copies file(s) or directories from a given source(s) to a specified destination.
 *
 * @param {string | string[]} sources - The path(s) to the file(s) or directory(ies) to be copied. This can be either a single string representing a path or an array of strings representing multiple paths.
 * @param {string} destination - The path to the destination where the files or directories should be copied.
 * @param {object} options - Copying file options
 */
const copyFiles = (sources, destination, options = {}) => {
    if (sources) {
        // Check if sources is defined
        if (Array.isArray(sources)) {
            // If it's an array, copy each item
            for (const source of sources) {
                fs.copySync(source, destination, options);
            }
        } else {
            // If it's a single string, copy it directly
            fs.copySync(sources, destination, options);
        }
    }
};

/**
 * Builds the project configuration based on user responses.
 * @param {Object} responses - The user responses from the project setup.
 * @returns {Object} An object containing the project settings or an error message.
 */
export const buildProjectConfig = (responses) => {
    // Extract project name, organization, and acronym from user responses
    const projectName = responses['project-name'];
    const projectOrganization = responses['project-organization'];
    const projectAcronym = responses['project-acronym'];
    const frontendFramework = responses['frontend-framework'];

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

    // Return the project configuration object with all paths and settings
    return {
        settings: {
            projectRootPath,
            projectName,
            projectOrganization,
            projectAcronym,
            projectRepository,
            frontendProjectName,
            frontendProjectPath,
            frontendPackageJsonPath,
            frontendFramework,
            isMonorepoProject,
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
 *
 * @param {Object} options - The configuration options for updating the package.json file.
 * @param {string} options.sourcePackageJsonPath - The path to the source package.json template file.
 * @param {string} options.destinationPackageJsonPath - The path to the destination package.json file.
 * @param {string} options.destinationProjectName - The name of the project.
 * @param {string} options.destinationProjectOrganization - The organization name for the project.
 * @param {string} options.destinationRepository - The repository URL for the project.
 * @param {string} options.destinationProjectAcronym - The acronym of the project.
 */
const updatePackageJson = ({
    sourcePackageJsonPath,
    destinationPackageJsonPath,
    destinationProjectName,
    destinationProjectOrganization,
    destinationRepository,
    destinationProjectAcronym,
}) => {
    // Read the source package.json file
    const updatedPackageJsonContent = fs
        .readFileSync(sourcePackageJsonPath)
        .toString()
        .replaceAll('project-organization', destinationProjectOrganization)
        .replaceAll('project-name', destinationProjectName)
        .replaceAll('project-acronym', destinationProjectAcronym)
        .replaceAll('project-repo', destinationRepository);

    // Write the updated content to the destination package.json
    fs.writeFileSync(destinationPackageJsonPath, updatedPackageJsonContent);
};

/**
 * Copies template files to the destination project and updates package.json.
 * @param {Object} options - Options for copying files.
 * @param {string} options.destinationProjectType - The type of project ('front' or 'lib').
 * @param {string} options.destinationProjectPath - The path to the destination project directory.
 * @param {string} options.destinationPackageJsonPath - The path to the destination package.json file.
 * @param {string} options.destinationProjectName - The name of the destination project.
 * @param {string} options.destinationProjectOrganization - The organization of the destination project.
 * @param {string} options.destinationRepository - The git repository name of the destination project.
 * @param {string} options.destinationProjectAcronym - The acronym of the destination project.
 */
export const createDestinationStructure = ({
    destinationProjectType,
    destinationProjectPath,
    destinationPackageJsonPath,
    destinationProjectName,
    destinationProjectOrganization,
    destinationRepository,
    destinationProjectAcronym,
}) => {
    // copy files from template
    const templateSourcePath =
        destinationProjectType === 'front' ? templateFrontSourcePath : templateLibSourcePath;
    copyFiles(templateSourcePath, destinationProjectPath);

    // update package json according to user inputs
    const templatePackageJsonPath =
        destinationProjectType === 'front'
            ? templateFrontPackageJsonPath
            : templateLibPackageJsonPath;
    updatePackageJson({
        sourcePackageJsonPath: templatePackageJsonPath,
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
 * @param {boolean} settings.hasSharedUtilsLib - Indicates whether the project has a shared utilities library.
 * @param {boolean} settings.hasSharedStorybook - Indicates whether the project has a shared Storybook.
 * @param {boolean} settings.hasSharedUiLib - Indicates whether the project has a shared UI library.
 */
export const createMonorepoProjectStructure = (settings) => {
    const {
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

    // copy pnpm workspace files
    copyFiles(`${templateRootPath}/pnpm-workspace.yaml`, `./${projectName}/pnpm-workspace.yaml`, {
        overwrite: null,
    });

    // optional shared utils lib
    if (hasSharedUtilsLib) {
        createDestinationStructure({
            destinationProjectType: 'lib',
            destinationProjectPath: sharedUtilsLibProjectPath,
            destinationPackageJsonPath: sharedUtilsLibPackageJsonPath,
            destinationProjectName: `@${projectAcronym}/${sharedUtilsLibProjectName}`,
            destinationProjectOrganization: projectOrganization,
            destinationProjectAcronym: projectAcronym,
            destinationRepository: projectRepository,
        });
    }

    // optional shared ui lib
    if (hasSharedUiLib) {
        createDestinationStructure({
            destinationProjectType: 'lib',
            destinationProjectPath: sharedUiLibProjectPath,
            destinationPackageJsonPath: sharedUiLibPackageJsonPath,
            destinationProjectName: `@${projectAcronym}/${sharedUiLibProjectName}`,
            destinationProjectOrganization: projectOrganization,
            destinationProjectAcronym: projectAcronym,
            destinationRepository: projectRepository,
        });
    }

    // optional shared storybook
    if (hasSharedStorybook) {
        createDestinationStructure({
            destinationProjectType: 'lib',
            destinationProjectPath: sharedStorybookProjectPath,
            destinationPackageJsonPath: sharedStorybookPackageJsonPath,
            destinationProjectName: `@${projectAcronym}/${sharedStorybookProjectName}`,
            destinationProjectOrganization: projectOrganization,
            destinationProjectAcronym: projectAcronym,
            destinationRepository: projectRepository,
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
    } = settings;

    // create root project
    fs.mkdirpSync(projectRootPath, { recursive: true });

    // create frontend module
    createDestinationStructure({
        destinationProjectType: 'front',
        destinationProjectPath: frontendProjectPath,
        destinationPackageJsonPath: frontendPackageJsonPath,
        destinationProjectName: `@${projectAcronym}/${frontendProjectName}`,
        destinationProjectOrganization: projectOrganization,
        destinationProjectAcronym: projectAcronym,
        destinationRepository: projectRepository,
    });

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
};
