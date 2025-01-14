import prompts from 'prompts';
import { describe, expect, it } from 'vitest';

import { BistroProjectStructureQuestions } from './bistro-project-structure-questions.js';

describe('Project creation prompts', () => {
    it('It should prompts monorepo questions', async () => {
        prompts.override({
            'project-name': 'vitality',
            'project-acronym': 'v6y',
            'project-organization': 'ekino',
            'frontend-framework': 'React',
            'project-monorepo': true,
            'shared-ui-lib': true,
            'shared-storybook': true,
            'shared-utils-lib': true,
        });
        const values = await prompts(BistroProjectStructureQuestions);
        expect(values).to.deep.equal({
            'project-name': 'vitality',
            'project-acronym': 'v6y',
            'project-organization': 'ekino',
            'frontend-framework': 'React',
            'project-monorepo': true,
            'shared-ui-lib': true,
            'shared-storybook': true,
            'shared-utils-lib': true,
        });
    });

    it('It should not prompts monorepo questions', async () => {
        prompts.override({
            'project-name': 'vitality',
            'project-acronym': 'v6y',
            'project-organization': 'ekino',
            'frontend-framework': 'React',
            'project-monorepo': false,
            'shared-ui-lib': true,
            'shared-storybook': true,
            'shared-utils-lib': true,
        });
        const values = await prompts(BistroProjectStructureQuestions);
        expect(values).to.deep.equal({
            'project-name': 'vitality',
            'project-acronym': 'v6y',
            'project-organization': 'ekino',
            'frontend-framework': 'React',
            'project-monorepo': false,
            'shared-storybook': true,
            'shared-ui-lib': true,
            'shared-utils-lib': true,
        });
    });
});
