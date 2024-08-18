import AppLogger from './core/AppLogger.js';
import { createProjectStructure } from './project-structure/bistro-project-structure-cli.js';

(async () => {
    try {
        await createProjectStructure();
        return true;
    } catch (error) {
        AppLogger.error(`A error was occurred while creating the project: ${error.message}`);
        // eslint-disable-next-line no-undef
        process.exit(1);
    }
})();
