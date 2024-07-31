import AppLogger from '../core/AppLogger.js';

export const configureReactApplication = (settings) => {
    AppLogger.info(`configureReactApplication: ${Object.keys(settings || {})?.join(',')}`);
};
