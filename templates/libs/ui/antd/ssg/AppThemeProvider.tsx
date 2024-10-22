import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import * as React from 'react';

import AppTheme from './AppTheme';
import { AppThemeProviderProps } from './AppThemeType';

const AppThemeProvider = ({ children }: AppThemeProviderProps) => (
    <AntdRegistry>
        <ConfigProvider theme={AppTheme}>{children}</ConfigProvider>
    </AntdRegistry>
);

export default AppThemeProvider;
