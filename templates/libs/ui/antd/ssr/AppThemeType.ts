import { ThemeConfig } from 'antd/es/config-provider/context';
import { ReactNode } from 'react';

export interface AppThemeProviderProps {
    theme: ThemeConfig;
    children: ReactNode;
}
