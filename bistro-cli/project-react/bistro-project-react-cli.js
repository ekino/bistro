import { configureSharedLib } from '../core/SharedLibUtils.js';
import { configureSharedStorybook } from '../core/StorybookUtils.js';
import { configureUiLib } from '../core/UiLibUtils.js';

export const configureReactApplication = async (settings) => {
    if (!settings) {
        return false;
    }

    // configure common ui lib settings and ui lib module settings if selected
    configureUiLib(settings);

    // configure optional storybook settings if selected
    configureSharedStorybook(settings);

    // configure shared lib settings if selected
    configureSharedLib(settings);
};
