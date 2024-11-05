import { ConfigProvider } from 'antd';
import * as React from 'react';

import AppTheme from './AppTheme';
import { AppThemeProviderProps } from './AppThemeType';

const AppThemeProvider = ({ children }: AppThemeProviderProps) => (
    <ConfigProvider theme={AppTheme}>{children}</ConfigProvider>
);

export default AppThemeProvider;
