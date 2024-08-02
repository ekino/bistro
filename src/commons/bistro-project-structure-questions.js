import { isMonorepo } from './bistro-cli-utils.js';

/**
 * An array of questions to gather information about the project structure.
 * Each question object has properties like `type`, `name`, `message`, and `initial`.
 * @type {Object[]}
 */
export const BistroProjectStructureQuestions = [
    {
        type: 'text',
        name: 'project-name',
        message: 'What is your project name (full name)?',
        initial: null,
    },
    {
        type: 'text',
        name: 'project-acronym',
        message: 'What is the project acronym (abbreviation, trigram, ...)?',
        initial: null,
    },
    {
        type: 'text',
        name: 'project-organization',
        message: 'What is the project organization?',
        initial: null,
    },
    {
        type: 'select',
        name: 'frontend-framework',
        message: 'Which framework does your project uses?',
        choices: [
            { title: 'React', value: 'react' },
            { title: 'Angular', value: 'angular' },
        ],
        initial: 0,
    },
    {
        type: 'confirm',
        name: 'project-monorepo',
        message: 'Is your project a monorepo?',
        initial: false,
    },
    {
        type: (prev, ...config) => (isMonorepo(config) ? 'confirm' : null),
        name: 'shared-ui-lib',
        message: 'Does it contain a shared UI library?',
        initial: false,
    },
    {
        type: (prev, ...config) => (isMonorepo(config) ? 'confirm' : null),
        name: 'shared-storybook',
        message: 'Does it contain a Storybook?',
        initial: false,
    },
    {
        type: (prev, ...config) => (isMonorepo(config) ? 'confirm' : null),
        name: 'shared-utils-lib',
        message: 'Does it contain a shared utilities library?',
        initial: false,
    },
];
