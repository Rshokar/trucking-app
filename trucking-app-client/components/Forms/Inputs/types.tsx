import { NativeSyntheticEvent, TextInputChangeEventData, TextInputProps } from 'react-native'
import { PickerProps } from '@react-native-picker/picker/typings/Picker'


interface ErrorProps {
    error: string | undefined,
    touched: boolean | undefined,
}
export interface InputProps extends TextInputProps {
    name: string,
    errorProps: ErrorProps
}

export interface SelectInputProps extends PickerProps {
    options: { label: string, value: string }[],
    onChange: (e: string | React.ChangeEvent<any>) => void,
    errorProps: ErrorProps,
    name: string
    value: string
}