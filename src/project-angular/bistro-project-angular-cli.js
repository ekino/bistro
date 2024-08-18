import AppLogger from '../core/AppLogger.js';

export const configureAngularApplication = async (settings) => {
    AppLogger.info(`configureAngularApplication: ${Object.keys(settings || {})?.join(',')}`);
};
