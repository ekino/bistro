import AppLogger from '../core/AppLogger.js';

export const configureAngularApplication = (settings) => {
    AppLogger.info(`configureAngularApplication: ${Object.keys(settings || {})?.join(',')}`);
};
