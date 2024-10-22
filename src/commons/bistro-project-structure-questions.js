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
        message: 'What is the full name of your project?',
        initial: null,
    },
    {
        type: 'text',
        name: 'project-acronym',
        message: 'What is a suitable acronym or abbreviation for your project (e.g., trigram)?',
        initial: null,
    },
    {
        type: 'text',
        name: 'project-organization',
        message: 'What is the organization or company behind this project?',
        initial: null,
    },
    {
        type: 'confirm',
        name: 'project-monorepo',
        message:
            'Will your project be structured as a monorepo (multiple packages in one repository)?',
        initial: false,
    },
    {
        type: (prev, ...config) => (isMonorepo(config) ? 'confirm' : null),
        name: 'shared-ui-lib',
        message: 'Will you have a shared UI component library?',
        initial: false,
    },
    {
        type: (prev, ...config) => (isMonorepo(config) ? 'confirm' : null),
        name: 'shared-storybook',
        message: 'Will you use Storybook for component documentation and development?',
        initial: false,
    },
    {
        type: (prev, ...config) => (isMonorepo(config) ? 'confirm' : null),
        name: 'shared-utils-lib',
        message: 'Will you have a shared library for common utilities and helper functions?',
        initial: false,
    },
    {
        type: 'select',
        name: 'frontend-framework',
        message: 'Which frontend framework will you be using?',
        choices: [
            { title: 'React', value: 'react' },
            { title: 'Angular', value: 'angular' },
        ],
        initial: 0,
    },
    {
        type: 'select',
        name: 'frontend-rendering-type',
        message: 'How will your frontend be rendered?',
        choices: [
            { title: 'CSR (Client-Side Rendering)', value: 'csr' },
            { title: 'SSR (Server-Side Rendering)', value: 'ssr' },
            { title: 'SSG (Static Site Generation)', value: 'ssg' },
        ],
        initial: 0,
    },

    // optional
    {
        type: 'select',
        name: 'frontend-styling-framework',
        message: 'Which styling approach will you use for your frontend?',
        choices: [
            { title: 'None (plain CSS/SCSS)', value: 'none' },
            { title: 'Styled Components (CSS-in-JS)', value: 'styled-components' },
            { title: 'Chakra UI (component library)', value: 'chakra-ui' },
            { title: 'Ant Design (component library)', value: 'antd' },
            { title: 'Material UI (component library)', value: 'material-ui' },
            { title: 'Tailwind CSS (utility-first CSS)', value: 'tailwind' },
        ],
        initial: 0,
    },
    {
        type: 'select',
        name: 'frontend-state-management-framework',
        message: 'Which state management solution do you prefer for your frontend?',
        choices: [
            { title: 'None', value: 'none' },
            { title: 'TanStack Query (for data fetching and caching)', value: 'tanStack-query' },
            { title: 'Zustand (lightweight state management)', value: 'zustand' },
            { title: 'Redux Toolkit (RTK Query included)', value: 'rtk-query' },
        ],
        initial: 0,
    },
    {
        type: 'select',
        name: 'frontend-schema-validation-framework',
        message: 'Which schema validation library do you prefer for your frontend?',
        choices: [
            { title: 'None', value: 'none' },
            { title: 'Zod', value: 'zod' },
            { title: 'Yup', value: 'yup' },
        ],
        initial: 0,
    },
    {
        type: 'select',
        name: 'frontend-e2e-framework',
        message: 'Which end-to-end (E2E) testing framework will you use?',
        choices: [
            { title: 'None', value: 'none' },
            { title: 'Cypress', value: 'cypress' },
            { title: 'Playwright', value: 'playwright' },
        ],
        initial: 0,
    },
];
