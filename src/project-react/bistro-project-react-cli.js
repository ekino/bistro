import AppLogger from '../core/AppLogger.js';

export const configureReactApplication = async (settings) => {
    AppLogger.info(`configureAngularApplication: ${Object.keys(settings || {})?.join(',')}`);
};
