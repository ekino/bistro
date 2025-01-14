/**
 * The root directory of the project.
 * @type {string}
 */
const rootPath = '.';

/**
 * Project base path
 * @type {string}
 */
const projectBasePath = 'src';

/**
 * The directory where project templates are stored.
 * @type {string}
 */
export const templateRootPath = './templates';

/**
 * Retrieves the frontend module settings for a specific framework.
 *
 * @param {string} framework - The framework for which to retrieve settings (e.g., "react", "angular").
 * @returns {Object} An object containing the settings for the specified framework.
 */
export const buildFrontendModuleSettings = (framework) => ({
    templateSourceDir: {
        /**
         * Path to the template for a Client-Side Rendered (CSR) project.
         * @type {string}
         */
        csr: `${templateRootPath}/${framework}/base-project-structure`,
        /**
         * Path to the template for a Server-Side Rendered (SSR) project.
         * @type {string}
         */
        ssr: `${templateRootPath}/${framework}/base-ssr-structure`,
        /**
         * Path to the template for a Static Site Generated (SSG) project.
         * @type {string}
         */
        ssg: `${templateRootPath}/${framework}/base-ssr-structure`,
    },
});

/**
 * Retrieves the build settings for a specific library type and framework.
 *
 * @param {string} framework - The framework for which to retrieve settings (e.g., "react", "angular").
 * @param {string} type - The type of library for which to retrieve settings (e.g., "utils", "ui", "storybook").
 * @returns {Object} An object containing the settings for the specified framework and library type.
 */
export const buildLibModuleSettings = (framework, type) =>
    ({
        utils: {
            /**
             * The source directory for library templates
             * @type {string}
             */
            sourceDirPath: `${templateRootPath}/${framework}/base-lib-structure`,
            /**
             * The path to the package.json file within the library template.
             * @type {string}
             */
            packageJsonPath: `${templateRootPath}/${framework}/base-lib-structure/package.json`,
            /**
             * The path to the bundler config file within the library template.
             * @type {string | null}
             */
            bundlerConfigPath: `${templateRootPath}/${framework}/base-lib-structure/vite.config.ts`,
        },
        ui: {
            /**
             * The source directory for ui library templates
             * @type {string}
             */
            sourceDirPath: `${templateRootPath}/${framework}/base-ui-lib-structure`,
            /**
             * The path to the package.json file within the ui library template.
             * @type {string}
             */
            packageJsonPath: `${templateRootPath}/${framework}/base-ui-lib-structure/package.json`,
            /**
             * The path to the bundler config file within the library template.
             * @type {string | null}
             */
            bundlerConfigPath: `${templateRootPath}/${framework}/base-ui-lib-structure/vite.config.ts`,
        },
        storybook: {
            /**
             * The source directory for storybook templates
             * @type {string}
             */
            sourceDirPath: `${templateRootPath}/${framework}/base-storybook-structure`,
            /**
             * The path to the package.json file within the storybook template.
             * @type {string}
             */
            packageJsonPath: `${templateRootPath}/${framework}/base-storybook-structure/package.json`,
            /**
             * The path to the bundler config file within the library template.
             * @type {string | null}
             */
            bundlerConfigPath: null,
        },
    })[type];

/**
 * Build Common Settings
 * @param responses
 * @returns {{frontendStylingFramework, frontendProjectPath: string, frontendPackageJsonPath: string, isMonorepoProject: boolean, frontendStateManagementFramework, projectRootPath: string, frontendE2EFramework, frontendFramework: string, frontendRenderingType, projectAcronym: string, frontendSchemaValidationFramework, projectName: string, projectOrganization: string, projectRepository: string, frontendProjectName: (string)}}
 */
export const buildCommonSettings = (responses) => {
    // Extract project name, organization, and acronym from user responses
    const projectName = responses['project-name'];
    const projectOrganization = responses['project-organization'];
    const projectAcronym = responses['project-acronym'];
    const frontendFramework = responses['frontend-framework'];
    const frontendRenderingType = responses['frontend-rendering-type'];

    // verify if user want to create monorepo
    const isMonorepoProject = responses['project-monorepo'];

    // Construct paths for project root
    const projectRootPath = isMonorepoProject
        ? `${rootPath}/${projectName}/${projectBasePath}`
        : `${rootPath}/${projectName}`; // Root path of the project
    const projectRepository = projectName;

    // Construct frontend settings
    let frontendProjectPath = isMonorepoProject
        ? `${projectRootPath}/${projectAcronym}-front`
        : projectRootPath;
    const frontendProjectName = isMonorepoProject ? 'front' : projectName;
    const frontendPackageJsonPath = `${frontendProjectPath}/package.json`;
    const frontendBundlerConfigPath = `${frontendProjectPath}/vite.config.ts`;

    // others frontend options
    const frontendStateManagementFramework = responses['frontend-state-management-framework'];
    const frontendStylingFramework = responses['frontend-styling-framework'];
    const frontendE2EFramework = responses['frontend-e2e-framework'];
    const frontendSchemaValidationFramework = responses['frontend-schema-validation-framework'];

    return {
        isMonorepoProject,
        projectRootPath,
        projectName,
        projectOrganization,
        projectAcronym,
        projectRepository,
        frontendProjectName,
        frontendProjectPath,
        frontendPackageJsonPath,
        frontendBundlerConfigPath,
        frontendFramework,
        frontendRenderingType,
        frontendStateManagementFramework,
        frontendStylingFramework,
        frontendE2EFramework,
        frontendSchemaValidationFramework,
    };
};

/**
 * Build monorepo settings
 * @param responses
 * @param commonSettings
 * @returns {{hasSharedUtilsLib: boolean, sharedUtilsLibProjectName: string, hasSharedStorybook: boolean, sharedStorybookProjectName: string, sharedUiLibProjectPath: string, hasSharedUiLib: boolean, sharedUtilsLibPackageJsonPath: string, sharedStorybookProjectPath: string, sharedStorybookPackageJsonPath: string, sharedUiLibPackageJsonPath: string, sharedUtilsLibProjectPath: string, sharedUiLibProjectName: string}|{}}
 */
export const buildMonorepoSettings = (responses, commonSettings) => {
    if (!commonSettings?.isMonorepoProject) {
        return {};
    }

    // optional settings
    const hasSharedUtilsLib = responses['shared-utils-lib'] || false;
    const hasSharedStorybook = responses['shared-storybook'] || false;
    const hasSharedUiLib = responses['shared-ui-lib'] || false;

    // shared utils lib settings
    const sharedUtilsLibProjectPath = hasSharedUtilsLib
        ? `${commonSettings?.projectRootPath}/${commonSettings?.projectAcronym}-commons`
        : null;
    const sharedUtilsLibProjectName = hasSharedUtilsLib ? 'commons' : null;
    const sharedUtilsLibPackageJsonPath = hasSharedUtilsLib
        ? `${sharedUtilsLibProjectPath}/package.json`
        : null;
    const sharedUtilsLibBundlerConfigPath = hasSharedUtilsLib
        ? `${sharedUtilsLibProjectPath}/vite.config.ts`
        : null;

    // storybook settings
    const sharedStorybookProjectPath = hasSharedStorybook
        ? `${commonSettings?.projectRootPath}/${commonSettings?.projectAcronym}-storybook`
        : null;
    const sharedStorybookProjectName = hasSharedStorybook ? 'storybook' : null;
    const sharedStorybookPackageJsonPath = hasSharedStorybook
        ? `${sharedStorybookProjectPath}/package.json`
        : null;
    const sharedStorybookBundlerConfigPath = hasSharedStorybook
        ? `${sharedStorybookProjectPath}/vite.config.ts`
        : null;

    // shared ui lib settings
    const sharedUiLibProjectPath = hasSharedUiLib
        ? `${commonSettings?.projectRootPath}/${commonSettings?.projectAcronym}-ui-commons`
        : null;
    const sharedUiLibProjectName = hasSharedUiLib ? 'ui-commons' : null;
    const sharedUiLibPackageJsonPath = hasSharedUiLib
        ? `${sharedUiLibProjectPath}/package.json`
        : null;
    const sharedUiLibBundlerConfigPath = hasSharedUiLib
        ? `${sharedUiLibProjectPath}/vite.config.ts`
        : null;

    return {
        hasSharedUtilsLib,
        hasSharedStorybook,
        hasSharedUiLib,
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
    };
};

/**
 * Builds the project settings based on user responses.
 * This function constructs project paths and settings based on user responses.
 * @param {Object} responses - The user responses from the project setup.
 * @returns {Object} An object containing the project settings or an error message.
 */
export const buildProjectSettings = (responses) => {
    const commonSettings = buildCommonSettings(responses);

    // Check if project details are provided
    if (!commonSettings?.projectName?.length) {
        return {
            settings: null,
            error: 'Project name is a required information to generate your git project!',
        };
    }
    if (!commonSettings?.projectOrganization?.length) {
        return {
            settings: null,
            error: 'Project organization is a required information to generate your git project!',
        };
    }
    if (!commonSettings?.projectAcronym?.length) {
        return {
            settings: null,
            error: 'Project acronym is a required information to generate your git project!',
        };
    }
    if (!commonSettings?.frontendFramework?.length) {
        return {
            settings: null,
            error: 'Project frontend framework is a required information to generate the settings!',
        };
    }
    if (!commonSettings?.frontendRenderingType?.length) {
        return {
            settings: null,
            error: 'Frontend Rendering Type is a required information to generate the settings!',
        };
    }

    // Returns simple project configuration
    if (!commonSettings?.isMonorepoProject) {
        return {
            settings: {
                ...commonSettings,
            },
            error: null,
        };
    }

    // Returns monorepo project configuration
    return {
        settings: {
            ...commonSettings,
            ...buildMonorepoSettings(responses, commonSettings),
        },
        error: null,
    };
};

/**
 * Build UI Library Settings
 * @param uiLib
 * @param renderingType
 * @returns {*}
 */
export const buildUiLibSettings = (uiLib, renderingType) => {
    const commonsSettings = {
        uiLibTemplateFilesPath: `${templateRootPath}/libs/ui/${uiLib}/${renderingType}`,
        frontendModuleThemeFilesDestinationPath: `${projectBasePath}/infrastructure/providers/theme`,
        sharedUiModuleThemeFilesDestinationPath: `src/commons/theme`,
    };

    const settings = {
        'chakra-ui': {
            csr: {
                dependencies: ['@chakra-ui/react', '@emotion/react', '@emotion/styled'],
            },
            ssr: {
                dependencies: [
                    '@chakra-ui/react',
                    '@chakra-ui/next-js',
                    '@emotion/react',
                    '@emotion/styled',
                ],
            },
            ssg: {
                dependencies: [
                    '@chakra-ui/react',
                    '@chakra-ui/next-js',
                    '@emotion/react',
                    '@emotion/styled',
                ],
            },
        },
        antd: {
            csr: {
                dependencies: ['@ant-design/icons', 'antd'],
            },
            ssr: {
                dependencies: ['@ant-design/icons', 'antd', '@ant-design/nextjs-registry'],
            },
            ssg: {
                dependencies: ['@ant-design/icons', 'antd', '@ant-design/nextjs-registry'],
            },
        },
    };

    return {
        ...commonsSettings,
        ...(settings?.[uiLib]?.[renderingType] || {}),
    };
};
