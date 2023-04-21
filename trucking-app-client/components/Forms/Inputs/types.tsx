import { TextInputProps } from 'react-native'


interface ErrorProps {
    error: string | undefined,
    touched: boolean | undefined,
}
export interface InputProps extends TextInputProps {
    name: string,
    errorProps: ErrorProps
}