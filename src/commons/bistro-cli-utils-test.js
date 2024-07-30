import { describe, expect, it } from 'vitest';

import { buildProjectConfig } from './bistro-cli-utils.js';

describe('Project structure creation', () => {
    it('It should generate an error (project-name empty)', () => {
        const { settings, error } = buildProjectConfig({
            'project-name': '',
            'project-organization': '',
            'project-acronym': '',
            'frontend-framework': '',
        });
        expect(settings).toEqual(null);
        expect(error).toEqual(
            'Project name is a required information to generate your git project!',
        );
    });

    it('It should generate an error (project-organization empty)', () => {
        const { settings, error } = buildProjectConfig({
            'project-name': 'vitality',
            'project-organization': '',
            'project-acronym': '',
            'frontend-framework': '',
        });
        expect(settings).toEqual(null);
        expect(error).toEqual(
            'Project organization is a required information to generate your git project!',
        );
    });

    it('It should generate an error (project-acronym empty)', () => {
        const { settings, error } = buildProjectConfig({
            'project-name': 'vitality',
            'project-organization': 'ekino',
            'project-acronym': '',
            'frontend-framework': '',
        });
        expect(settings).toEqual(null);
        expect(error).toEqual(
            'Project acronym is a required information to generate your git project!',
        );
    });

    it('It should generate an error (frontend-framework empty)', () => {
        const { settings, error } = buildProjectConfig({
            'project-name': 'vitality',
            'project-organization': 'ekino',
            'project-acronym': 'v6y',
            'frontend-framework': '',
        });
        expect(settings).toEqual(null);
        expect(error).toEqual(
            'Project frontend framework is a required information to generate the settings!',
        );
    });

    it('It should generate correct config (monorepo === false)', () => {
        const { settings, error } = buildProjectConfig({
            'project-name': 'vitality',
            'project-organization': 'ekino',
            'project-acronym': 'v6y',
            'frontend-framework': 'React',
            'project-monorepo': false,
            'shared-utils-lib': true,
            'shared-storybook': true,
            'shared-ui-lib': true,
        });
        expect(settings).toEqual({
            frontendFramework: 'React',
            frontendPackageJsonPath: './vitality/package.json',
            frontendProjectName: 'vitality',
            frontendProjectPath: './vitality',
            isMonorepoProject: false,
            projectAcronym: 'v6y',
            projectName: 'vitality',
            projectOrganization: 'ekino',
            projectRootPath: './vitality',
            projectRepository: 'vitality',
        });
        expect(error).toEqual(null);
    });

    it('It should generate correct config (monorepo === true, generating all modules)', () => {
        const { settings, error } = buildProjectConfig({
            'project-name': 'vitality',
            'project-organization': 'ekino',
            'project-acronym': 'v6y',
            'frontend-framework': 'React',
            'project-monorepo': true,
            'shared-utils-lib': true,
            'shared-storybook': true,
            'shared-ui-lib': true,
        });
        expect(settings).toEqual({
            frontendFramework: 'React',
            projectAcronym: 'v6y',
            projectName: 'vitality',
            projectOrganization: 'ekino',
            projectRootPath: './vitality/src',
            projectRepository: 'vitality',
            frontendPackageJsonPath: './vitality/src/v6y-front/package.json',
            frontendProjectName: 'front',
            frontendProjectPath: './vitality/src/v6y-front',
            hasSharedStorybook: true,
            hasSharedUiLib: true,
            hasSharedUtilsLib: true,
            isMonorepoProject: true,
            sharedStorybookPackageJsonPath: './vitality/src/v6y-storybook/package.json',
            sharedStorybookProjectName: 'storybook',
            sharedStorybookProjectPath: './vitality/src/v6y-storybook',
            sharedUiLibPackageJsonPath: './vitality/src/v6y-ui-commons/package.json',
            sharedUiLibProjectName: 'ui-commons',
            sharedUiLibProjectPath: './vitality/src/v6y-ui-commons',
            sharedUtilsLibPackageJsonPath: './vitality/src/v6y-commons/package.json',
            sharedUtilsLibProjectName: 'commons',
            sharedUtilsLibProjectPath: './vitality/src/v6y-commons',
        });
        expect(error).toEqual(null);
    });

    it('It should generate correct config (monorepo === true, storybook === false)', () => {
        const { settings, error } = buildProjectConfig({
            'project-name': 'vitality',
            'project-organization': 'ekino',
            'project-acronym': 'v6y',
            'frontend-framework': 'React',
            'project-monorepo': true,
            'shared-utils-lib': true,
            'shared-storybook': false,
            'shared-ui-lib': true,
        });
        expect(settings).toEqual({
            frontendFramework: 'React',
            projectAcronym: 'v6y',
            projectName: 'vitality',
            projectOrganization: 'ekino',
            projectRootPath: './vitality/src',
            projectRepository: 'vitality',
            frontendPackageJsonPath: './vitality/src/v6y-front/package.json',
            frontendProjectName: 'front',
            frontendProjectPath: './vitality/src/v6y-front',
            hasSharedStorybook: false,
            hasSharedUiLib: true,
            hasSharedUtilsLib: true,
            isMonorepoProject: true,
            sharedStorybookPackageJsonPath: null,
            sharedStorybookProjectName: null,
            sharedStorybookProjectPath: null,
            sharedUiLibPackageJsonPath: './vitality/src/v6y-ui-commons/package.json',
            sharedUiLibProjectName: 'ui-commons',
            sharedUiLibProjectPath: './vitality/src/v6y-ui-commons',
            sharedUtilsLibPackageJsonPath: './vitality/src/v6y-commons/package.json',
            sharedUtilsLibProjectName: 'commons',
            sharedUtilsLibProjectPath: './vitality/src/v6y-commons',
        });
        expect(error).toEqual(null);
    });

    it('It should generate correct config (monorepo === true, sharedUiLib === false)', () => {
        const { settings, error } = buildProjectConfig({
            'project-name': 'vitality',
            'project-organization': 'ekino',
            'project-acronym': 'v6y',
            'frontend-framework': 'React',
            'project-monorepo': true,
            'shared-utils-lib': true,
            'shared-storybook': true,
            'shared-ui-lib': false,
        });
        expect(settings).toEqual({
            frontendFramework: 'React',
            projectAcronym: 'v6y',
            projectName: 'vitality',
            projectOrganization: 'ekino',
            projectRootPath: './vitality/src',
            projectRepository: 'vitality',
            frontendPackageJsonPath: './vitality/src/v6y-front/package.json',
            frontendProjectName: 'front',
            frontendProjectPath: './vitality/src/v6y-front',
            hasSharedStorybook: true,
            hasSharedUiLib: false,
            hasSharedUtilsLib: true,
            isMonorepoProject: true,
            sharedStorybookPackageJsonPath: './vitality/src/v6y-storybook/package.json',
            sharedStorybookProjectName: 'storybook',
            sharedStorybookProjectPath: './vitality/src/v6y-storybook',
            sharedUiLibPackageJsonPath: null,
            sharedUiLibProjectName: null,
            sharedUiLibProjectPath: null,
            sharedUtilsLibPackageJsonPath: './vitality/src/v6y-commons/package.json',
            sharedUtilsLibProjectName: 'commons',
            sharedUtilsLibProjectPath: './vitality/src/v6y-commons',
        });
        expect(error).toEqual(null);
    });

    it('It should generate correct config (monorepo === true, sharedUtilsLib === false)', () => {
        const { settings, error } = buildProjectConfig({
            'project-name': 'vitality',
            'project-organization': 'ekino',
            'project-acronym': 'v6y',
            'frontend-framework': 'React',
            'project-monorepo': true,
            'shared-utils-lib': false,
            'shared-storybook': true,
            'shared-ui-lib': true,
        });
        expect(settings).toEqual({
            frontendFramework: 'React',
            projectAcronym: 'v6y',
            projectName: 'vitality',
            projectOrganization: 'ekino',
            projectRootPath: './vitality/src',
            projectRepository: 'vitality',
            frontendPackageJsonPath: './vitality/src/v6y-front/package.json',
            frontendProjectName: 'front',
            frontendProjectPath: './vitality/src/v6y-front',
            hasSharedStorybook: true,
            hasSharedUiLib: true,
            hasSharedUtilsLib: false,
            isMonorepoProject: true,
            sharedStorybookPackageJsonPath: './vitality/src/v6y-storybook/package.json',
            sharedStorybookProjectName: 'storybook',
            sharedStorybookProjectPath: './vitality/src/v6y-storybook',
            sharedUiLibPackageJsonPath: './vitality/src/v6y-ui-commons/package.json',
            sharedUiLibProjectName: 'ui-commons',
            sharedUiLibProjectPath: './vitality/src/v6y-ui-commons',
            sharedUtilsLibPackageJsonPath: null,
            sharedUtilsLibProjectName: null,
            sharedUtilsLibProjectPath: null,
        });
        expect(error).toEqual(null);
    });
});
