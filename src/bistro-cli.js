import { createProjectStructure } from './project-structure/bistro-project-structure-cli.js';

(async () => {
    try {
        await createProjectStructure();
        return true;
    } catch (error) {
        // eslint-disable-next-line no-console,no-undef
        console.error('createProjectStructure: ', error);
        process.exit(1);
    }
})();
