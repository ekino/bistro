import { execSync } from 'child_process';

import {
    copyFiles,
    createDirectory,
    readFileContent,
    writeContentToFile,
} from '../core/FileUtils.js';
import {
    buildFrontendModuleSettings,
    buildLibModuleSettings,
    templateRootPath,
} from './bistro-cli-settings.js';

/**
 * Checks if the given configuration represents a monorepo project.
 * This function looks for the specific configuration key 'project-monorepo' to determine if it's a monorepo.
 * @param {Object} config - The project configuration object.
 * @returns {boolean} True if it's a monorepo, false otherwise.
 */
export const isMonorepo = (config) => config?.[0]?.['project-monorepo'] || false;

/**
 * Updates a package.json file with project-specific details.
 * This function replaces placeholders in the package.json with actual project details.
 *
 * @param {Object} options - The configuration options for updating the package.json file.
 * @param {string} options.sourceConfigPath - The path to the source template file.
 * @param {string} options.destinationConfigPath - The path to the destination file.
 * @param {string} options.destinationProjectPath - The path to the destination project directory.
 * @param {string} options.destinationProjectName - The name of the project.
 * @param {string} options.destinationProjectOrganization - The organization name for the project.
 * @param {string} options.destinationRepository - The repository URL for the project.
 * @param {string} options.destinationProjectAcronym - The acronym of the project.
 */
const updateFileConfigContent = ({
    sourceConfigPath,
    destinationConfigPath,
    destinationProjectPath,
    destinationProjectName,
    destinationProjectOrganization,
    destinationRepository,
    destinationProjectAcronym,
}) => {
    // Read the source file
    const updatedFileContent = readFileContent(sourceConfigPath)
        .replaceAll('project-organization', destinationProjectOrganization)
        .replaceAll('project-name', destinationProjectName)
        .replaceAll('project-acronym', destinationProjectAcronym)
        .replaceAll('project-repo', destinationRepository);
    if (!updatedFileContent?.length) {
        return;
    }

    // Write the updated content to the destination file
    writeContentToFile(destinationConfigPath, updatedFileContent);

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
    // build frontend settings according to framework
    const frontendSettings = buildFrontendModuleSettings(destinationFrontendFramework);

    // copy files from template
    const templateFrontSourcePath =
        frontendSettings.templateSourceDir[destinationFrontendRenderingType];
    copyFiles(templateFrontSourcePath, destinationProjectPath);

    // update package json according to user inputs
    const templateFrontPackageJsonPath = `${templateFrontSourcePath}/package.json`; // Path to frontend template package.json
    updateFileConfigContent({
        sourceConfigPath: templateFrontPackageJsonPath,
        destinationConfigPath: destinationPackageJsonPath,
        destinationProjectPath,
        destinationProjectName,
        destinationProjectOrganization,
        destinationRepository,
        destinationProjectAcronym,
    });
};

/**
 * Creates the destination directory structure for a new library and populates it with template files.
 *
 * @param {Object} options - Options for creating the library structure.
 * @param {string} options.frontendFramework - The frontend framework for the library (e.g., "react", "angular").
 * @param {string} options.libType - The type of library (e.g., "utils", "ui", "storybook").
 * @param {string} options.destinationProjectPath - The path to the destination project directory.
 * @param {string} options.destinationPackageJsonPath - The path to the destination package.json file.
 * @param {string} options.destinationBundlerConfigPath - The path to the destination bundler config file.
 * @param {string} options.destinationProjectName - The name of the destination project.
 * @param {string} options.destinationProjectOrganization - The organization for the destination project (e.g., "@my-org").
 * @param {string} options.destinationRepository - The repository URL for the destination project.
 * @param {string} options.destinationProjectAcronym - The acronym for the destination project.
 */
export const createLibDestinationStructure = ({
    frontendFramework,
    libType,
    destinationProjectPath,
    destinationPackageJsonPath,
    destinationBundlerConfigPath,
    destinationProjectName,
    destinationProjectOrganization,
    destinationRepository,
    destinationProjectAcronym,
}) => {
    // lib settings according to framework and type
    const libSettings = buildLibModuleSettings(frontendFramework, libType);

    // copy files from template
    copyFiles(libSettings.sourceDirPath, destinationProjectPath);

    // update package json according to user inputs
    if (libSettings?.packageJsonPath?.length) {
        updateFileConfigContent({
            sourceConfigPath: libSettings.packageJsonPath,
            destinationConfigPath: destinationPackageJsonPath,
            destinationProjectPath,
            destinationProjectName,
            destinationProjectOrganization,
            destinationRepository,
            destinationProjectAcronym,
        });
    }

    // update bundler config according to user inputs
    if (libSettings?.bundlerConfigPath?.length) {
        updateFileConfigContent({
            sourceConfigPath: libSettings.bundlerConfigPath,
            destinationConfigPath: destinationBundlerConfigPath,
            destinationProjectPath,
            destinationProjectName,
            destinationProjectOrganization,
            destinationRepository,
            destinationProjectAcronym,
        });
    }
};

/**
 * Creates the structure for a monorepo project by conditionally copying files for shared libraries.
 * @param {*|{frontendStylingFramework, frontendProjectPath: string, frontendPackageJsonPath: string, isMonorepoProject: boolean, frontendStateManagementFramework, projectRootPath: string, frontendE2EFramework, frontendFramework: string, frontendRenderingType, projectAcronym: string, frontendSchemaValidationFramework, projectName: string, projectOrganization: string, projectRepository: string, frontendProjectName: string}|{frontendStylingFramework, frontendProjectPath: string, frontendPackageJsonPath: string, isMonorepoProject: boolean, frontendStateManagementFramework, projectRootPath: string, frontendE2EFramework, frontendFramework: string, frontendRenderingType, projectAcronym: string, frontendSchemaValidationFramework, projectName: string, projectOrganization: string, projectRepository: string, frontendProjectName: string}} settings - The project settings object.
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
        sharedUtilsLibBundlerConfigPath,
        sharedStorybookProjectName,
        sharedStorybookProjectPath,
        sharedStorybookPackageJsonPath,
        sharedStorybookBundlerConfigPath,
        sharedUiLibProjectName,
        sharedUiLibProjectPath,
        sharedUiLibPackageJsonPath,
        sharedUiLibBundlerConfigPath,
        hasSharedUtilsLib,
        hasSharedStorybook,
        hasSharedUiLib,
        frontendFramework,
    } = settings;

    if (!isMonorepoProject) {
        return;
    }

    // copy pnpm workspace files
    copyFiles(`${templateRootPath}/pnpm-workspace.yaml`, `./${projectName}/pnpm-workspace.yaml`, {
        overwrite: null,
    });

    // optional shared storybook
    if (hasSharedStorybook) {
        createLibDestinationStructure({
            frontendFramework,
            libType: 'storybook',
            destinationProjectPath: sharedStorybookProjectPath,
            destinationPackageJsonPath: sharedStorybookPackageJsonPath,
            destinationBundlerConfigPath: sharedStorybookBundlerConfigPath,
            destinationProjectName: `@${projectAcronym}/${sharedStorybookProjectName}`,
            destinationProjectOrganization: projectOrganization,
            destinationRepository: projectRepository,
            destinationProjectAcronym: projectAcronym,
        });
    }

    // optional shared ui lib
    if (hasSharedUiLib) {
        createLibDestinationStructure({
            frontendFramework,
            libType: 'ui',
            destinationProjectPath: sharedUiLibProjectPath,
            destinationPackageJsonPath: sharedUiLibPackageJsonPath,
            destinationBundlerConfigPath: sharedUiLibBundlerConfigPath,
            destinationProjectName: `@${projectAcronym}/${sharedUiLibProjectName}`,
            destinationProjectOrganization: projectOrganization,
            destinationRepository: projectRepository,
            destinationProjectAcronym: projectAcronym,
        });
    }

    // optional shared utils lib
    if (hasSharedUtilsLib) {
        createLibDestinationStructure({
            frontendFramework,
            libType: 'utils',
            destinationProjectPath: sharedUtilsLibProjectPath,
            destinationPackageJsonPath: sharedUtilsLibPackageJsonPath,
            destinationBundlerConfigPath: sharedUtilsLibBundlerConfigPath,
            destinationProjectName: `@${projectAcronym}/${sharedUtilsLibProjectName}`,
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
    } = settings;

    // create root project
    createDirectory(projectRootPath, { recursive: true });

    // copy commons files
    copyFiles([`${templateRootPath}/.gitignore`], `./${projectName}/.gitignore`, {
        overwrite: null,
    });

    // update common config
    updateFileConfigContent({
        sourceConfigPath: `${templateRootPath}/package.json`,
        destinationConfigPath: `./${projectName}/package.json`,
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
