// SnackbarContext.tsx
import React, { createContext, ReactNode } from 'react';
import { useState } from 'react';
import { Snackbar } from 'react-native-paper';
import { colors } from '../components/colors';

interface SnackbarContextProps {
    show: boolean;
    message: string;
    color?: string;
    onClick?: () => void;
    onClickText?: string;
    showSnackbar: (config: SnackbarConfig) => void;
    hideSnackbar: () => void;
}

interface SnackbarProviderProps {
    children: ReactNode;
}

interface SnackbarConfig {
    message: string;
    color?: string;
    onClick?: () => void;
    onClickText?: string;
}

const defaultContextData = {
    show: false,
    onClickText: 'Ok',
    color: colors.primary,
    message: '',
    showSnackbar: () => { },
    hideSnackbar: () => { },
};

export const SnackbarContext = createContext<SnackbarContextProps>(defaultContextData);

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
    const [state, setState] = useState(defaultContextData);

    const showSnackbar = (config: SnackbarConfig) => {
        setState({ ...state, ...config, show: true });
    };

    const hideSnackbar = () => {
        setState({ ...state, show: false });
    };



    return (
        <SnackbarContext.Provider value={{ ...state, showSnackbar, hideSnackbar }}>
            {children}
            <Snackbar
                visible={state.show}
                onDismiss={hideSnackbar}
                action={{
                    label: state.onClickText || 'Ok',
                    onPress: hideSnackbar,
                }}
                duration={Snackbar.DURATION_SHORT}
                style={{ backgroundColor: state.color }}
            >
                {state.message}
            </Snackbar>
        </SnackbarContext.Provider>
    );
};
